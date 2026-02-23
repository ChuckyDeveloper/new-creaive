import path from "path";
import { promises as fs } from "fs";
import { ensureDir } from "./helper";

export type ScheduleItem = {
  image: string;
  link: string;
  uptime: string;
  downtime: string;
};

export function getDriveImageUrl(url: string) {
  const match = url.match(/\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  return match && match[1]
    ? `https://drive.google.com/uc?export=download&id=${match[1]}`
    : url;
}

export function parseSimpleCsv(text: string): ScheduleItem[] {
  // Very simple CSV split; for complex CSV, plug a parser library.
  return text
    .split(/\r?\n/)
    .map((r) => r.split(",").map((c) => c.trim()))
    .filter((r) => r.length >= 4)
    .map((row) => ({
      image: row[0] ?? "",
      link: row[1] ?? "",
      uptime: row[2] ?? "",
      downtime: row[3] ?? "",
    }));
}

export function findActiveItem(items: ScheduleItem[], now = new Date()) {
  const parseDate = (str: string) => new Date(str.replace(" ", "T"));
  return items.find((item) => {
    const up = parseDate(item.uptime);
    const down = parseDate(item.downtime);
    return (
      !isNaN(up.getTime()) &&
      !isNaN(down.getTime()) &&
      now >= up &&
      now <= down
    );
  });
}


export async function persistEventImage(data: Buffer | ArrayBuffer, filename = "event.png") {
  const buffer = data instanceof Buffer ? data : Buffer.from(data);
  const dir = path.join(process.cwd(), "public", "event");
  await ensureDir(dir);
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, buffer);

  return {
    filePath,
    publicUrl: `/event/${filename}`.replace(/\\/g, "/"),
  };
}
