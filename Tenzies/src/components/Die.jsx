export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    return (
        <button 
        style={styles}
        /* the onclick passes the anonymous funcion that says "run this function" so we can add in props as parameters */
        onClick={() => props.hold(props.id)}
        aria-pressed={props.isHeld}
        aria-label={`Die with a value of ${props.value}, ${props.isHeld ? "held" : "not held"}`}
        >{props.value}</button>
    )
}