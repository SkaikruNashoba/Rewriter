import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Panier from "../Views/UserViews/Panier";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Panier">
                <Panier/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews