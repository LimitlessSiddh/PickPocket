import Marquee from 'react-fast-marquee';
import nba from "../assets/nba_logo.png";
import nfl from "../assets/nfl_logo.png";
import pga from "../assets/pga_logo.png";
import nhl from "../assets/nhl_logo.png";
import ufc from "../assets/ufc_logo.png";

const logos = [nba, nfl, pga, nhl, ufc];

const SportLogos = () => {
    return (
        <section className='w-[85%] flex justify-between items-center mt-12'>
            <Marquee speed={120} gradient={true}>

                    {
                        logos.map((logo, index) => (
                            <img
                                src={logo}
                                alt="sportLogos"
                                key={index}
                                className='w-auto h-20 px-20'
                            />

                        ))
                    }


            </Marquee>
        </section>

    );
}

export default SportLogos;