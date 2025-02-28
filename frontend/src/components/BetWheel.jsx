import { Marquee } from  'react-fast-marquee';


const BetWheel = () => {
    return (
        <section>
            <Marquee speed={40} gradient={false}>
                <p>Welcome To PickPocket</p>
                <p>Odd1</p>
                <p>Odd2</p>
            </Marquee>
        </section>

    );
}

export default BetWheel;