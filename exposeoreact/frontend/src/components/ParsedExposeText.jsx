const ParsedExposeText = ({ text, images }) => {
    const parts = text.split(/\[BILD(\d+)\]/i); // Trennt bei [BILD1], [BILD2] etc.

    return (
        <div className="space-y-4 text-gray-800 leading-relaxed">
            {parts.map((part, index) => {
                const imgIndex = parseInt(part, 10) - 1;

                // Wenn 'part' eine Zahl ist (z. B. "1"), versuche ein Bild einzufügen
                if (!isNaN(imgIndex) && images[imgIndex]) {
                    return (
                        <img
                            key={index}
                            src={images[imgIndex]}
                            alt={`Bild ${imgIndex + 1}`}
                            className="w-full rounded shadow"
                        />
                    );
                }

                // Ansonsten normalen Text zurückgeben
                return <p key={index}>{part}</p>;
            })}
        </div>
    );
};
export default ParsedExposeText;