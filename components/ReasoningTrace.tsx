'use client';
import { useEffect, useRef } from 'react';
import type { ReasoningStep } from '@/types/investigator';
import * as Icon from './Icons';

type Props = {
  steps: ReasoningStep[];
  isRunning: boolean;
  onClose?: () => void;
};

export default function ReasoningTrace({ steps, isRunning, onClose }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [steps]);

  if (!isRunning && steps.length === 0) return null;

  return (
    <div style={{
      background: 'var(--atlas-bg-sunken)',
      border: '1px solid var(--atlas-border)',
      borderRadius: 8,
      overflow: 'hidden',
      marginTop: 16,
    }}>
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid var(--atlas-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isRunning && <Icon.Loader size={14} />}
          <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--atlas-font-mono)' }}>
            Agent reasoning trace
          </span>
          {!isRunning && steps.length > 0 && (
            <span className="badge badge-success" style={{ height: 16, fontSize: 10 }}>complete</span>
          )}
        </div>
        {onClose && (
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '0 4px', height: 20 }}>
            <Icon.X size={12} />
          </button>
        )}
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const isDone = !isRunning || !isLast;
          return (
            <div key={step.id} className="trace-step">
              <div className={`trace-dot ${isDone ? 'trace-dot-done' : 'trace-dot-active'}`} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--atlas-fg-subtle)', marginBottom: 1 }}>
                  {step.agent}
                </div>
                <div className="trace-text">{step.action}</div>
                {step.detail && (
                  <div className="trace-text" style={{ color: 'var(--atlas-fg-subtle)', marginTop: 2 }}>{step.detail}</div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
