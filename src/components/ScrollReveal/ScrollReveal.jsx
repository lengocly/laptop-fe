import classNames from 'classnames';
import useScrollReveal from '@/hooks/useScrollReveal';
import styles from './styles.module.scss';

/**
 * Bọc section/card — khi cuộn tới sẽ nổi lên mượt (fade + translate).
 */
function ScrollReveal({
    children,
    variant = 'up',
    delay = 0,
    duration = 750,
    className,
    as: Tag = 'div',
    once = true,
    threshold,
    rootMargin,
}) {
    const { ref, isVisible } = useScrollReveal({ once, threshold, rootMargin });

    const variantClass = {
        up: styles.up,
        left: styles.left,
        right: styles.right,
        scale: styles.scale,
        fade: styles.fade,
    }[variant];

    return (
        <Tag
            ref={ref}
            className={classNames(
                styles.reveal,
                variantClass,
                isVisible && styles.visible,
                className
            )}
            style={{
                transitionDelay: `${delay}ms`,
                transitionDuration: `${duration}ms`,
            }}
        >
            {children}
        </Tag>
    );
}

export default ScrollReveal;
