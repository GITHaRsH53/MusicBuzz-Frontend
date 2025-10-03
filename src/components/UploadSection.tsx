import { useMemo, useState } from "react";
import Papa from "papaparse";                 // npm i papaparse
import { saveAs } from "file-saver";          // npm i file-saver
import { Button } from "@/components/ui/button";
import { Upload, FileDown, Search, Music, Clipboard, Download } from "lucide-react";

// Read your backend base URL from Vite env
const API_BASE = import.meta.env.VITE_API_BASE as string;

/** helper to download a CSV string as a file */
function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}

type Row = { song: string; artist: string };

export default function UploadSection() {
  // ----- Parse state -----
  const [order, setOrder] = useState<"artist-song" | "song-artist">("artist-song");
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

  // ----- Matching / playlist state -----
  const [matching, setMatching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Results from /api/spotify/search
  const [matchResults, setMatchResults] = useState<null | {
    results: Array<{
      input_song: string;
      input_artist: string;
      found: number;
      duplicate: boolean;
      uri: string | null;
      matched_song: string | null;
      matched_artist: string | null;
      isrc: string | null;
      id: string | null;
      error?: string;
    }>;
    summary: { total: number; found: number; notFound: number; duplicates: number };
  }>(null);

  // --------- Parse pasted text → rows ----------
  const parseText = () => {
    const out: Row[] = input
      .split("\n")
      .map((line) => {
        let s = line.trim();
        if (!s) return null;

        let song = "";
        let artist = "";

        if (s.includes("-")) {
          const [left, right] = s.split("-").map((x) => x.trim());
          if (order === "artist-song") {
            artist = left;
            song = right;
          } else {
            song = left;
            artist = right;
          }
        } else if (/by/i.test(s)) {
          const [left, right] = s.split(/by/i).map((x) => x.trim());
          song = left;
          artist = right || "";
        } else {
          song = s;
          artist = "";
        }

        return { song, artist };
      })
      .filter(Boolean) as Row[];

    setRows(out);
    setMatchResults(null);
    setPlaylistUrl(null);
  };

  // --------- Parse uploaded CSV → rows ----------
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (res) => {
        const cleaned = (res.data as any[])
          .map((rec) => ({
            song: (rec.song || "").trim(),
            artist: (rec.artist || "").trim(),
          }))
          .filter((r) => r.song || r.artist);

        setRows(cleaned);
        setMatchResults(null);
        setPlaylistUrl(null);
      },
    });
  };

  // --------- Download normalized CSV ----------
  const downloadNormalized = () => {
    if (!rows.length) return;
    const csv = Papa.unparse(rows);
    downloadCSV("playlist.csv", csv);
  };

  // --------- Hit backend: /api/spotify/search ----------
  const matchOnSpotify = async () => {
    if (!rows.length) return;
    setErrMsg(null);
    setMatching(true);
    setMatchResults(null);
    setPlaylistUrl(null);

    try {
      const res = await fetch(`${API_BASE}/api/spotify/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // cookies from NextAuth must flow to the backend
        credentials: "include",
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Search failed");

      setMatchResults(data);
    } catch (e: any) {
      setErrMsg(e.message || String(e));
    } finally {
      setMatching(false);
    }
  };

  // --------- Download match report CSV ----------
  const downloadReport = () => {
    if (!matchResults) return;

    const csv = Papa.unparse(
      matchResults.results.map((r) => ({
        song: r.input_song,
        artist: r.input_artist,
        found: r.found ? 1 : 0,
        duplicate: r.duplicate ? 1 : 0,
        matched_song: r.matched_song || "",
        matched_artist: r.matched_artist || "",
        uri: r.uri || "",
        isrc: r.isrc || "",
      }))
    );
    downloadCSV("spotify_match_report.csv", csv);
  };

  // URIs we’ll add to the playlist (skip duplicates + not-found)
  const playableUris = useMemo(
    () =>
      (matchResults?.results || [])
        .filter((r) => r.found && r.uri && !r.duplicate)
        .map((r) => r.uri!) as string[],
    [matchResults]
  );

  // --------- Hit backend: /api/spotify/playlist ----------
  const createPlaylist = async () => {
    if (!playableUris.length) {
      setErrMsg("No matched tracks to add. Please run Match on Spotify first.");
      return;
    }
    setErrMsg(null);
    setCreating(true);
    setPlaylistUrl(null);

    try {
      const name = `MusicBuzz ${new Date().toLocaleString()}`;
      const res = await fetch(`${API_BASE}/api/spotify/playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, uris: playableUris, isPublic: false }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Playlist create failed");

      setPlaylistUrl(data.url || null);
    } catch (e: any) {
      setErrMsg(e.message || String(e));
    } finally {
      setCreating(false);
    }
  };

  return (
    <section id="upload" className="py-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CSV Upload
            </span>{" "}
            (or paste text)
          </h2>
          <p className="text-muted-foreground">
            Upload a CSV with <code>song, artist</code> columns or paste text like
            <code> Artist - Song </code> or <code> Song by Artist</code>.
          </p>
        </div>

        {/* File upload */}
        <div className="space-y-2 mb-6">
          <label className="text-sm text-muted-foreground">Upload CSV (columns: song, artist)</label>
          <div className="flex gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={onFile}
              className="block w-full rounded-md border border-border bg-background px-3 py-2"
            />
            <Button onClick={downloadNormalized} disabled={!rows.length} className="whitespace-nowrap">
              <FileDown className="mr-2 h-4 w-4" /> Download normalized CSV
            </Button>
          </div>
        </div>

        <div className="text-center my-6 text-muted-foreground">— OR —</div>

        {/* Paste text */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <label className="text-sm text-muted-foreground">Paste songs (one per line)</label>
            <select
              className="rounded-md border border-border bg-background px-3 py-2"
              value={order}
              onChange={(e) => setOrder(e.target.value as any)}
            >
              <option value="artist-song">Artist - Song</option>
              <option value="song-artist">Song - Artist</option>
            </select>
          </div>

          <textarea
            className="w-full rounded-md border border-border bg-background p-3 min-h-[160px]"
            placeholder={"Post Malone - Circles\nBlinding Lights by The Weeknd"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="mt-3">
            <Button onClick={parseText}>
              <Clipboard className="mr-2 h-4 w-4" /> Parse Text
            </Button>
          </div>
        </div>

        {/* Preview + actions */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <strong>Parsed rows:</strong> {rows.length}
            <Button
              variant="secondary"
              onClick={downloadNormalized}
              disabled={!rows.length}
            >
              <Download className="mr-2 h-4 w-4" /> Download normalized CSV
            </Button>
          </div>

          {/* Action buttons: Match / Report / Create */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={matchOnSpotify}
              disabled={!rows.length || matching}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Search className="mr-2 h-4 w-4" />
              {matching ? "Matching…" : "Match on Spotify"}
            </Button>

            <Button
              variant="secondary"
              onClick={downloadReport}
              disabled={!matchResults}
            >
              <FileDown className="mr-2 h-4 w-4" /> Download match report CSV
            </Button>

            <Button
              onClick={createPlaylist}
              disabled={!playableUris.length || creating}
              className="bg-primary"
            >
              <Music className="mr-2 h-4 w-4" />
              {creating ? "Creating…" : "Create Playlist"}
            </Button>
          </div>

          {/* Summary + success link */}
          {matchResults && (
            <div className="mt-4 text-sm text-muted-foreground">
              <strong>Match Summary:</strong>{" "}
              {matchResults.summary.found}/{matchResults.summary.total} found •{" "}
              {matchResults.summary.notFound} not found •{" "}
              {matchResults.summary.duplicates} duplicates
            </div>
          )}

          {playlistUrl && (
            <div className="mt-3">
              <a
                className="text-primary underline"
                href={playlistUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open playlist on Spotify →
              </a>
            </div>
          )}

          {errMsg && (
            <div className="mt-3 text-red-400">
              {errMsg}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
