import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import Tesseract from 'tesseract.js';
import {Box, Button, Container, Typography} from '@mui/material';
import CustomSnackBar from "../../Scripts/CustomSnackBar";

const Main = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [textContent, setTextContent] = useState('');
    const [extractedText, setExtractedText] = useState('');

    const [verif, setVerif] = useState(false)
    const [alertMessage, setAlertMessage] = useState("");
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };



    const preprocessImage = (image) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const threshold = 200;
        const backgroundColor = [0, 0, 230];

        for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3; // Luminosité approximative

            const isBackgroundColor =
                Math.abs(data[i] - backgroundColor[0]) < threshold &&
                Math.abs(data[i + 1] - backgroundColor[1]) < threshold &&
                Math.abs(data[i + 2] - backgroundColor[2]) < threshold;

            if (isBackgroundColor) {
                data[i] = data[i + 1] = data[i + 2] = 255;
            }
        }

        context.putImageData(imageData, 0, 0);

        return canvas.toDataURL();
    };

    const filterText = (text) => {

        const regexToRemove = [
            /[•●▶]/gm,
            /\n\[ \.\\ \.\. \.\\ \| 4/gm,
            / v\ne e /gm,
            /L ""\),\n@ " /gm,
            /L\nd’/gm,
            / = S : = “; i/gm,
            /’f’ g L; s "‘\?ﬂr‘ g\n/gm,
            / ::: ‘ii ‘J‘ o/gm,
            /C\n\( K \*T’« Lo \.\./gm,
            /&\nLI ETRY . j e /gm,
            /i o\n\(y - ‘ /gm,
            / L\n/gm,
            /- He e e 1 /gm,
            /\nVe s i \[ /gm,
            /\nSh o /gm,
            /\ne 3¢ /gm,
            /\n- ;'\\ §- %1 /gm,
            /\n’D/gm,
            /\nS ¢ /gm,
            /\ngy /gm,
            /\n‘ j ] /gm,
        ];

        const combinedRegex = new RegExp(regexToRemove.map(regex => regex.source).join('|'), 'gm');

        return text.replace(combinedRegex, ' ')
            .replace(/(?<=\n)e(?= [A-Z])/gm, '-')
            .replace(/(?<!\n)\n(?=[A-Z]+\.)/gm, '<br /><br />')
            .replace(/(?<=\n)[^\n\wéà«]+/gm, ' ')
            .replace(/(?<=\n)[^\n\wéà«]+[a-z] /gm, ' ')
            .replace(/(?<=\n)[a-zA-Z] /gm, ' ')
            .replace(/(?<=\n)[^\n\wéà«]+[a-z][a-z] /gm, ' ')
            .replace(/(?<=\n)[a-zA-Z] [?3¢] /gm, ' ')
            .replace(/\n/gm, '<br />');
    };

    const copyToClipboard = () => {
        if (extractedText) {
            const textToCopy = extractedText.replace(/<br \/>/g, '\n');
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setVerif(true)
            setSnackBarOpen(true);
            setAlertMessage("Texte copié")
        }
    };


    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const imageUrl = URL.createObjectURL(file);
        setImageSrc(imageUrl);

        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
            const preprocessedImageUrl = preprocessImage(image);
            // console.log("preprocessedImageUrl ===>", preprocessedImageUrl)

            Tesseract.recognize(preprocessedImageUrl)
                .then(({data: {text}}) => {
                    // console.log("text ===> ", text)
                    const filteredText = filterText(text);
                    setExtractedText(filteredText);
                    // console.log("filteredText ===> ", filteredText)
                });
        };
    };

    const {getRootProps, getInputProps} = useDropzone({onDrop});

    useEffect(() => {
        setTextContent(extractedText);
    }, [extractedText]);

    return (
        <Container maxWidth={'xl'} sx={{marginY: 3}}>
            <Box {...getRootProps()} sx={{display: 'flex', justifyContent: 'center'}}>
                <input {...getInputProps()} />
                <Button
                    variant={'contained'}
                    sx={{
                        bgcolor: "green",
                        transition: "0.2s",
                        "&:hover": {bgcolor: "darkgreen", transform: "scale(0.95)"}
                    }}
                >
                    Cliquez pour sélectionner une image
                </Button>
            </Box>
            {imageSrc && (
                <Box sx={{display: 'flex', justifyContent: 'space-between', marginY: 2}}>
                    <img src={imageSrc} alt="Image avec texte"
                         style={{padding: 1, border: '1px solid black', maxWidth: 700}}/>
                    <Box sx={{marginX: 2, border: '1px solid black', padding: 2, position: "relative"}}>
                        <Button
                            variant="contained"
                            onClick={copyToClipboard}
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bgcolor: "green",
                                transition: "0.2s",
                                "&:hover": {bgcolor: "darkgreen", transform: "scale(0.95)"}
                            }}
                        >
                            Copier
                        </Button>
                        <Typography variant={'body1'} sx={{fontWeight: 'bold', paddingY: 2}}>
                            Texte extrait:
                        </Typography>
                        <Typography variant={'subtitle2'} dangerouslySetInnerHTML={{__html: extractedText}}/>
                    </Box>
                </Box>
            )}
            <CustomSnackBar
                open={snackBarOpen}
                message={alertMessage}
                severity={verif === true ? "success" : "error"}
                onClose={handleSnackBarClose}
            />
        </Container>
    );
};

export default Main;
