"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import Link from "next/link";

/* ────────────────────────── types ────────────────────────── */
export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

export interface StaggeredMenuProps {
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredMenuItem[];
  displayItemNumbering?: boolean;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  isFixed?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

/* ────────────────────────── component ────────────────────── */
export default function StaggeredMenu({
  position = "left",
  colors = ["#e2e8f0", "#cbd5e1"],
  items = [],
  displayItemNumbering = true,
  menuButtonColor = "#000",
  openMenuButtonColor = "#000",
  accentColor = "#3b82f6",
  isFixed = true,
  onMenuOpen,
  onMenuClose,
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  /* ── toggle ─────────────────────────────────────────────── */
  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) onMenuOpen?.();
      else onMenuClose?.();
      return next;
    });
  }, [onMenuOpen, onMenuClose]);

  /* ── close on click outside (exclude toggle button) ─────── */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setOpen(false);
        onMenuClose?.();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onMenuClose]);

  /* ── close on Escape ────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        onMenuClose?.();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onMenuClose]);

  const isLeft = position === "left";
  const offscreenTransform = isLeft ? "-translate-x-full" : "translate-x-full";

  /* pre-layer colors */
  const layerColors = colors.slice(0, 3);

  return (
    <>
      {/* ── Toggle Button ────────────────────────────────── */}
      <button
        ref={btnRef}
        onClick={toggle}
        className={`${isFixed ? "fixed" : "absolute"} top-4 ${isLeft ? "left-4" : "right-4"
          } z-[60] flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 shadow-sm cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:shadow`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        type="button"
      >
        <span className="relative w-5 h-5 flex items-center justify-center">
          <span
            className="absolute w-full h-[2px] rounded transition-all duration-300"
            style={{
              backgroundColor: open ? openMenuButtonColor : menuButtonColor,
              transform: open ? "rotate(45deg)" : "translateY(-3px)",
            }}
          />
          <span
            className="absolute w-full h-[2px] rounded transition-all duration-300"
            style={{
              backgroundColor: open ? openMenuButtonColor : menuButtonColor,
              transform: open ? "rotate(-45deg)" : "translateY(3px)",
            }}
          />
        </span>
      </button>

      {/* ── Overlay ─────────────────────────────────────── */}
      <div
        className={`${isFixed ? "fixed" : "absolute"} inset-0 z-[45] bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      />

      {/* ── Decorative Pre-Layers ────────────────────────── */}
      {layerColors.map((color, i) => (
        <div
          key={i}
          className={`${isFixed ? "fixed" : "absolute"} top-0 ${isLeft ? "left-0" : "right-0"
            } h-full z-[48] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] w-[clamp(280px,38vw,420px)] ${open ? "translate-x-0" : offscreenTransform
            }`}
          style={{
            background: color,
            transitionDelay: open ? `${i * 60}ms` : `${(layerColors.length - i) * 40}ms`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* ── Main Panel ──────────────────────────────────── */}
      <aside
        ref={panelRef}
        className={`${isFixed ? "fixed" : "absolute"} top-0 ${isLeft ? "left-0" : "right-0"
          } h-full z-[50] w-[clamp(280px,38vw,420px)] bg-white flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] overflow-y-auto ${open ? "translate-x-0" : offscreenTransform
          }`}
        style={{
          transitionDelay: open ? `${layerColors.length * 60 + 60}ms` : "0ms",
        }}
        aria-hidden={!open}
      >
        <nav className="flex-1 flex flex-col justify-center px-8 py-20 gap-3">
          <ul className="list-none m-0 p-0 flex flex-col gap-1">
            {items.map((item, idx) => (
              <li
                key={item.label}
                className="overflow-hidden"
                style={{ "--sm-accent": accentColor } as React.CSSProperties}
              >
                <Link
                  href={item.link}
                  aria-label={item.ariaLabel}
                  className="group relative block py-1 no-underline"
                  onClick={() => {
                    setOpen(false);
                    onMenuClose?.();
                  }}
                >
                  <span
                    className={`block text-[1.75rem] sm:text-[2.25rem] font-bold leading-[1.15] tracking-tight uppercase text-gray-900 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:text-[var(--sm-accent)] truncate pr-4 ${open
                        ? "translate-y-0 opacity-100 rotate-0"
                        : "translate-y-[120%] opacity-0 rotate-[8deg]"
                      }`}
                    style={{
                      transitionDelay: open
                        ? `${layerColors.length * 60 + 120 + idx * 80}ms`
                        : `${(items.length - idx) * 30}ms`,
                      transformOrigin: "bottom left",
                    }}
                  >
                    {displayItemNumbering && (
                      <span
                        className="text-sm font-normal tracking-normal mr-3 opacity-50 transition-colors duration-200 group-hover:opacity-100"
                        style={{ color: accentColor }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    )}
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-8 py-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">FleetFlow v1.0</p>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          aside[class*="w-[clamp"] { width: 100% !important; }
          div[class*="w-[clamp"] { width: 100% !important; }
        }
      `}</style>
    </>
  );
}
