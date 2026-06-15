import { dataInfo } from './constants';
import InfoCard from './InfoCard/InfoCard';
import MainLayout from '@components/Layout/Layout';
import ScrollReveal from '@components/ScrollReveal/ScrollReveal';
import styles from './styles.module.scss';

//Khối đen thông tin đầu trang
function Info() {
    const { container } = styles;
    return (
        <MainLayout>
            <div className={container}>
                {dataInfo.map((item, index) => (
                    <ScrollReveal
                        key={item.title}
                        variant="up"
                        delay={index * 90}
                        duration={650}
                    >
                        <InfoCard
                            content={item.title}
                            description={item.description}
                            src={item.src}
                        />
                    </ScrollReveal>
                ))}
            </div>
        </MainLayout>
    );
}

export default Info;
