import { css } from '@emotion/css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from './Button';
import CloseButton from './CloseButton';
import Dialog from './Dialog';
import Spinner from './Spinner';

type Props = {
    open: boolean,
    onCloseRequest: () => void,
    promptText: string
}

const EditTrainingTextDialog = ({
    open,
    onCloseRequest,
    promptText
}: Props) => {
    const [newPromptText, setNewPromptText] = useState(promptText)
    useEffect(() => setNewPromptText(promptText), [promptText])
    const [status, setStatus] = useState<'editing' | 'loading' | 'saved'>('editing')
    const [promptId, setPromptId] = useState()

    const router = useRouter()
    async function saveText() {
        setStatus('loading')
        const res = await fetch('/api/prompts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: newPromptText
            }),
          }).then(res => res.json())
        setPromptId(res.id)
        setStatus('saved')
        router.push(`/${res.id}`)
    }

    useEffect(() => {
        if (!open) {
            setStatus('editing')
        }
    }, [open])

    return (
        <Dialog 
            isOpen={open}
            contentLabel="Edit Training Text Dialog"
            onRequestClose={onCloseRequest}
            className={style}
        >
            {status === 'editing' && <>
                <p>Editing the training text:</p>
                <CloseButton className="closeButton" onClick={onCloseRequest} />
                <textarea value={newPromptText} onChange={e => setNewPromptText(e.target.value)}></textarea>
                <Button className="saveButton" onClick={saveText}>Save</Button>
                {}
            </>}
            {status === 'loading' && <>
                <Spinner />
            </>}
            {status === 'saved' && <>
                <p>Send the following link to whoever you wish to complete the training exercise.</p>
                <input 
                    className="url"
                    value={`${location.origin}/${promptId}`}
                >
                </input>
                <div className="options">
                    <Button onClick={() => setStatus('editing')}>
                        Return to editing
                    </Button>
                    <Button onClick={onCloseRequest}>
                        Use new prompt text
                    </Button>
                </div>
            </>}
        </Dialog>
    )
}

export default EditTrainingTextDialog

const style = css`
    textarea {
        width: 100%;
        height: fit-content;
        flex: 1 1 auto;
    }

    .url {
        width: 100%;
    }
    
    .saveButton {
        align-self: flex-end;
    }

    .options {
        display: flex;
        justify-content: flex-end;
        align-self: stretch;
    }
`