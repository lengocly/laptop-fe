import styles from './styles.module.scss';

// HeaderSidebar là một component con của Compare, hiển thị icon và tiêu đề của header
function HeaderSidebar({ icon, title }) {
    const { container } = styles;

    return (
        <div className={container}>
            {icon}
            <div>{title}</div>
        </div>
    );
}

export default HeaderSidebar;
