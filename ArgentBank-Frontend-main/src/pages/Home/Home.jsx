import React from 'react';
import Banner from '../../components/Banner.jsx';
import Item from '../../components/Item.jsx';
import FeaturesItemData from '../../data/FeaturesItemData.json';
import iconChat from '../../assets/icons/icon-chat.webp';
import iconMoney from '../../assets/icons/icon-money.webp';
import iconSecurity from '../../assets/icons/icon-security.webp';
import '../../sass/pages/_Home.scss';

/* Home page */
function Home () {
    const imageData = {
        "icon-chat.webp": iconChat,
        "icon-money.webp": iconMoney,
        "icon-security.webp": iconSecurity
    }

    return (
        <div className='homepage'>
            <main>
                {/* Returns banner*/}
                <Banner />
                <section className="features">
                    <h2 className='sr-only'>Features</h2>
                    {/* Génère dynamiquement les "features" en parcourant le fichier JSON */}
                    {FeaturesItemData.map((data) => (
                        /* Affiche un composant Item pour chaque entrée du JSON */
                        < Item 
                            key={data.id} /* Clé unique pour React */
                            image={imageData[data.image]} /* Image correspondante */
                            descriptionImage={data.descriptionImage}
                            title={data.title}
                            description={data.description}
                        />
                    ))}
                </section>
            </main>
        </div>
    )
}

export default Home