import React, {useEffect, useState} from 'react';
import $ from 'jquery';

const TruncatedText = ({text, maxLength}) => {
    const [truncatedText, setTruncatedText] = useState(text);

    useEffect(() => {
        $('.truncate-text').each(function () {
            const content = $(this).text();
            const shouldTruncate = content.length > maxLength;
            const truncated = shouldTruncate ? content.substring(0, maxLength) + "..." : content;
            $(this).text(truncated);
        });
        setTruncatedText(text.length > maxLength ? text.substring(0, maxLength) + "..." : text);
    }, [text, maxLength]);

    return (
        <>
            <i className="flaticon-facebook-placeholder-for-locate-places-on-maps"></i>
            <span className={"truncate-text"}>{truncatedText}</span>
        </>
    );
};

export default TruncatedText;
