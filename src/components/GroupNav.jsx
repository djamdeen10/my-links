import { useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/index.jsx';

export function GroupNav({ groups, active, onChange }) {
  const { t } = useI18n();
  const trackRef = useRef(null);
  const buttonRefs = useRef(new Map());
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const button = buttonRefs.current.get(active);
      const track = trackRef.current;
      if (!button || !track) return;

      const buttonRect = button.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      setPill({
        left: buttonRect.left - trackRect.left,
        top: buttonRect.top - trackRect.top,
        width: buttonRect.width,
        height: buttonRect.height,
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    const activeButton = buttonRefs.current.get(active);
    if (activeButton) observer.observe(activeButton);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [active]);

  return (
    <div
      role="group"
      aria-label={t('a11y.filterLinks')}
      className="relative flex w-full max-w-[340px] items-center gap-1 rounded-full border border-white/12 bg-neutral-900/60 p-1.5"
    >
      <span ref={trackRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className="tab-pill-slide absolute rounded-full bg-neutral-700"
          style={{
            left: `${pill.left}px`,
            top: `${pill.top}px`,
            width: `${pill.width}px`,
            height: `${pill.height}px`,
          }}
        />
      </span>

      {groups.map((group) => {
        const isActive = group.id === active;

        return (
          <button
            key={group.id}
            ref={(node) => {
              if (node) buttonRefs.current.set(group.id, node);
              else buttonRefs.current.delete(group.id);
            }}
            type="button"
            aria-pressed={isActive}
            aria-controls="links-panel"
            onClick={() => onChange(group.id)}
            className={[
              'relative z-10 flex-1 rounded-full px-3 py-2 text-center text-[13px] font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/50',
              isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200',
            ].join(' ')}
          >
            {group.label}
          </button>
        );
      })}
    </div>
  );
}
