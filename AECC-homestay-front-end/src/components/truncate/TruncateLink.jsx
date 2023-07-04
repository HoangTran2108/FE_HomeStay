import React, { useEffect, useState } from 'react';
import $ from 'jquery';

const TruncatedLink = ({ url, text, maxLength }) => {
    const [truncatedText, setTruncatedText] = useState(text);

    useEffect(() => {
        $('.truncate-link').each(function () {
            const content = $(this).text();
            const shouldTruncate = content.length > maxLength;
            const truncated = shouldTruncate ? content.substring(0, maxLength) + "..." : content;
            $(this).text(truncated);
        });
        setTruncatedText(text.length > maxLength ? text.substring(0, maxLength) + "..." : text);
    }, [text, maxLength]);

    return (
        <a href={url} className="truncate-link">
            {truncatedText}
        </a>
    );
};

export default TruncatedLink;
