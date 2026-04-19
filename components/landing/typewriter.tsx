"use client";

import { useEffect, useState } from "react";

type Props = {
  texts: string[];
  speed?: number;
  pauseMs?: number;
};

export function Typewriter({ texts, speed = 50, pauseMs = 2200 }: Props) {
  const [display, setDisplay] = useState("");
  const [ti, setTi] = useState(0);
  const [ci, setCi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const target = texts[ti];
    const delay = deleting ? speed / 2.2 : speed;
    const t = setTimeout(() => {
      if (!deleting) {
        if (ci < target.length) {
          setDisplay(target.slice(0, ci + 1));
          setCi((c) => c + 1);
        } else {
          setPaused(true);
          setTimeout(() => {
            setDeleting(true);
            setPaused(false);
          }, pauseMs);
        }
      } else if (ci > 0) {
        setDisplay(target.slice(0, ci - 1));
        setCi((c) => c - 1);
      } else {
        setDeleting(false);
        setTi((i) => (i + 1) % texts.length);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [ci, deleting, paused, speed, pauseMs, texts, ti]);

  return (
    <span>
      {display}
      <span className="animate-blink ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-emerald-700" />
    </span>
  );
}
