import styles from './styles.module.scss';
import classNames from 'classnames';
function Button({ content, isPrimary = true, onClick, disabled = false }) {
    const { btn, primaryBtn, secondaryBtn } = styles;
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={classNames(btn, {
                [primaryBtn]: isPrimary,
                [secondaryBtn]: !isPrimary,
            })}
        >
            {content}
        </button>
    );
}
export default Button;

