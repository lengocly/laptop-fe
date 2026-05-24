import styles from './styles.module.scss';
import classNames from 'classnames';

// go to shop
// có 2 loại button: primaryBtn và secondaryBtn, mặc định là primaryBtn, nếu muốn là secondaryBtn thì truyền isPrimary = false vào props
function Button({ content, isPrimary = true, onClick, disabled = false }) {
    const { btn, primaryBtn, secondaryBtn } = styles;  // chỉ 3 class

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
