import {
    FiMessageCircle,
    FiPackage,
    FiShield,
    FiTruck,
} from 'react-icons/fi';
import { headerMarqueeItems } from './constants';
import styles from './styles.module.scss';

const MARQUEE_ICONS = {
    warranty: FiPackage,
    shipping: FiTruck,
    guarantee: FiShield,
    support: FiMessageCircle,
};

function MarqueeRow({ ariaHidden = false }) {
    const { marqueeContent, marqueeItem, marqueeIcon, marqueeDot } = styles;

    return (
        <div className={marqueeContent} aria-hidden={ariaHidden || undefined}>
            {headerMarqueeItems.map((item, index) => {
                const Icon = MARQUEE_ICONS[item.id];

                return (
                    <span key={item.id} className={marqueeItem}>
                        {index > 0 && (
                            <span className={marqueeDot} aria-hidden="true">
                                •
                            </span>
                        )}
                        <Icon className={marqueeIcon} aria-hidden="true" />
                        <span>{item.text}</span>
                    </span>
                );
            })}
        </div>
    );
}

function HeaderMarquee() {
    const { marqueeBar, marqueeTrack } = styles;

    return (
        <div className={marqueeBar} aria-label="Thông tin dịch vụ BetaTech">
            <div className={marqueeTrack}>
                <MarqueeRow />
                <MarqueeRow ariaHidden />
            </div>
        </div>
    );
}

export default HeaderMarquee;
