import { useId } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import classNames from 'classnames';

/**
 * Logo BetaTech — SVG vector, hỗ trợ nền sáng (header) và nền tối (footer).
 */
function BetaTechLogo({ variant = 'light', className, asLink = true }) {
    const uid = useId().replace(/:/g, '');
    const gradId = `bt-grad-${uid}`;
    const glowId = `bt-glow-${uid}`;

    const isDark = variant === 'dark';
    const betaFill = isDark ? '#f8fafc' : '#0f172a';
    const tagFill = isDark ? 'rgba(248,250,252,0.55)' : '#64748b';

    const svg = (
        <svg
            className={classNames(styles.logo, className)}
            viewBox="0 0 220 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="BetaTech"
            role="img"
        >
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563eb" />
                    <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
                <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Icon mark */}
            <rect
                x="0"
                y="4"
                width="40"
                height="40"
                rx="11"
                fill={`url(#${gradId})`}
                filter={isDark ? `url(#${glowId})` : undefined}
            />
            <path
                d="M12 14h9.5c3.2 0 5.5 1.6 5.5 4.2 0 1.6-.9 2.9-2.3 3.5 1.8.5 3.1 2 3.1 4.1 0 3.1-2.6 5.2-6.4 5.2H12V14zm4.2 3.6v4.5h4.8c1.5 0 2.4-.7 2.4-2.2s-.9-2.3-2.4-2.3h-4.8zm0 8.1v4.8h5.4c1.8 0 2.9-.8 2.9-2.4 0-1.5-1.1-2.4-3-2.4h-5.3z"
                fill="#fff"
            />
            <path
                d="M10 34h22"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.5"
                strokeLinecap="round"
            />

            {/* Wordmark */}
            <text
                x="52"
                y="31"
                fill={betaFill}
                fontFamily="'Segoe UI', system-ui, -apple-system, sans-serif"
                fontSize="22"
                fontWeight="700"
                letterSpacing="-0.5"
            >
                Beta
            </text>
            <text
                x="108"
                y="31"
                fill={`url(#${gradId})`}
                fontFamily="'Segoe UI', system-ui, -apple-system, sans-serif"
                fontSize="22"
                fontWeight="700"
                letterSpacing="-0.5"
            >
                Tech
            </text>
            <text
                x="52"
                y="44"
                fill={tagFill}
                fontFamily="'Segoe UI', system-ui, -apple-system, sans-serif"
                fontSize="8.5"
                fontWeight="500"
                letterSpacing="0.12em"
            >
                E-COMMERCE
            </text>
        </svg>
    );

    if (asLink) {
        return (
            <Link to="/" className={styles.link} aria-label="BetaTech — Trang chủ">
                {svg}
            </Link>
        );
    }

    return svg;
}

export default BetaTechLogo;
