import styles from './styles.module.scss';
import { FiEye } from 'react-icons/fi';
import { FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';

function InputCommon({ label, type, isRequired = false, value = '', onChange, name, }) {
    //value: Chữ đang gõ
    //onChange: Hàm cập nhật khi gõ
    //name: Tên field (email, password)
    
    const { labelInput, boxInput, container, boxIcon } = styles;

    //tạo state để quản lý việc hiển thị mật khẩu khi type là password
    const [showPassword, setShowPassword] = useState(false);

    //kiểm tra nếu type là password thì hiển thị icon mắt để người dùng có thể xem mật khẩu đã nhập
    const isPassword = type === 'password';

    const isShowTextPassword =
        type === 'password' && showPassword ? 'text' : type; //nếu type là password và showPassword = true thì hiển thị input có type là text, ngược lại ...

    const handleShowPassword = () => {
        setShowPassword(!showPassword); //đảo ngược giá trị của showPassword để hiển thị hoặc ẩn mật khẩu
    };

    return (
        <div className={container}>
            <div className={labelInput}>
                {label}
                {isRequired && <span>*</span>}
            </div>
            <div className={boxInput}>
            <input
                type={isShowTextPassword}
                value={value}
                onChange={onChange}
                name={name}
            />
                {isPassword && (
                    <div className={boxIcon} onClick={handleShowPassword}>
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                        {/* hiển thị icon mắt nếu showPassword = false, ngược lại hiển thị icon mắt có gạch chéo */}
                    </div>
                )}
            </div>
        </div>
    );
}

export default InputCommon;
