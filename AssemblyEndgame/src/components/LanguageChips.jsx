import { languages } from './languages'
import Chips from './Chips'

export default function LanguageChips() {
    
    const languageElements = languages.map(lang => 
        (
            <Chips key={lang.name} id={lang.name} color={lang.color} background={lang.background} />
        ))
    return (
        <>
           {languageElements}
        </>
    )
}