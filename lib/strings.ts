export function breakIntoSentences(text: string) {
    // Remove this when regex lookbehinds are supported in all browsers we
    // support.
    if (!lookbehindIsSupported()) {
        let regex = /\.\s+(?=\S)/;
        let remainingText = text;
        const sentences = []
        let match = regex.exec(remainingText)
        while (match) {
            const cutIndex = match.index + match?.[0]?.length
            sentences.push(
                remainingText.slice(0, cutIndex)
            )
            remainingText = remainingText.slice(cutIndex)
            match = regex.exec(remainingText)
        }
        if (remainingText) {
            sentences.push(remainingText)
        }
        return sentences
    }

    // RegEx must be created via a string rather than a literal otherwise
    // it will bork browsers that don't support lookbehinds even if those
    // browsers never execute this line.
    return text.split(new RegExp("(?<=\\.\\s+)(?=\\S)", "g"))

    function lookbehindIsSupported() {
        try {
            return !!(
            "text-test1-behind-test2-test3"
                .match(
                    new RegExp("(?<=behind)-test\\d", "g")
                )?.[0] === "-test2" &&
            "behind-test1-test2"
                .match(
                    new RegExp("(?<!behind)-test\\d", "g")
                )?.[0] === "-test2"
            );
        } catch (error) {
            return false;
        }
    }
}

export function escapeRegExp(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}