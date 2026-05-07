import styles from './styles.module.scss';
import Footer from '@icons/images/footer.png';
import { dataMenu } from './constant';

function MyFooter() {
    const { container, boxNav } = styles;
    return (
        <div className={container}>
            <div>
                <img src={Footer} alt='' width={300} height={150} />
            </div>

            <div className={boxNav}>
                {dataMenu.map((item) => (
                    <div>{item.content}</div>
                ))}
            </div>

            <div>
                <p style={{ textAlign: 'center', marginTop: '50px' }}>
                    Phương thức thanh toán an toàn
                </p>
                <img
                    src='https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/elementor/thumbs/Icons-123-pzks3go5g30b2zz95xno9hgdw0h3o8xu97fbaqhtb6.png'
                    alt=''
                />
            </div>
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                Copyright © 2026 BetaTech theme. Created by 8theme – WordPress
                WooCommerce themes.
            </div>
        </div>
    );
}

export default MyFooter;
