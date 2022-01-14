import { css, cx } from '@emotion/css';
import Modal from 'react-modal';
import CloseButton from './CloseButton';

type Props = {
    className: string,
} & Modal['props']

Modal.setAppElement('#app');

const Dialog = ({
    isOpen,
    onRequestClose,
    children,
    className,
    ...modalProps
}: Props) => {
    return (
        <Modal 
            {...modalProps}
            isOpen={isOpen}
            contentLabel="Edit Training Text Dialog"
            onRequestClose={onRequestClose}
            className={cx(style, className)}
        >
            <CloseButton className="closeButton" onClick={onRequestClose} />
            {children}
        </Modal>
    )
}
export default Dialog

const style = css`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: min(500px, 80%);
    height: min(300px, 80%);
    border: 1px solid #ccc;
    background: #fff;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 4px;
    outline: none;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    align-items: flex-start;

    .closeButton {
        position: absolute;
        top: 0.2em;
        right: 0.2em;
    }
`