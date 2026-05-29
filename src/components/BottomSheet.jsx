import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function BottomSheet({ isOpen, onClose, children, className = '', maxHeight = '85vh' }) {
  // The sheet is portaled to <body> (so it escapes any transformed ancestor, e.g.
  // PageTransition's x animation, which would otherwise become its containing block).
  // We then pin it to the .app-shell's real on-screen box so it always overlays the
  // phone frame exactly — regardless of whether the shell is centered in the window.
  const [box, setBox] = useState(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return undefined;
    const measure = () => {
      const el = document.querySelector('.app-shell');
      if (el) {
        const r = el.getBoundingClientRect();
        setBox({ left: r.left, width: r.width });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [isOpen]);

  const sheetStyle = box
    ? { left: box.left, width: box.width, maxHeight }
    : { left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, maxHeight };

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[1200] bg-ink-950/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 600) onClose?.();
            }}
            className={`fixed bottom-0 z-[1210] glass-strong rounded-t-[28px] shadow-elevated border-b-0 ${className}`}
            style={sheetStyle}
          >
            <div className="flex justify-center pt-3 pb-1">
              <span className="block h-1 w-10 rounded-full bg-line" />
            </div>
            <div
              className="px-5 pb-8 pt-2 overflow-y-auto hide-scroll"
              style={{ maxHeight: `calc(${maxHeight} - 24px)` }}
            >
              {children}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
