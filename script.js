const SPOTIFY_TOKEN = 'BQCDUSkvMdby9TqkSYEYP8hPew75P76HUc8qb8c9c5jnSAnItZ5KK6eb5Wg51UdqG1Lvggs9XgZrPEl6OvJetLIYTq4wOYSkDSKQ9rtgyCVyppwatNOf-xbsaL_uULpUU2aqnXHbG5DgOwoM8TbumOKEgHpRo5qt9r6IzdEd9JFGiiCL0WJ6SrSGUVvO2UeVc-GFXlc22AgoMNPO0QWnjWeMGY1QiElTqSEf5ZeZnLYMXu8e0Rm1akGFkfUHZQoCztUDKwKXHNboZ0XykmJx8gePTIN0Dd2K';
const ARTIST_ID = '0O202ZSWYbhYQZqpmd4y8d';

async function getLatestRelease() {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?limit=1`, {
            headers: {
                'Authorization': `Bearer ${SPOTIFY_TOKEN}`
            }
        });
        
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const latestRelease = data.items[0];
            displayTrack(latestRelease);
        }
    } catch (error) {
        console.error('Error fetching latest release:', error);
        document.getElementById('latest-track').innerHTML = `
            <p>Error al cargar el último lanzamiento.</p>
        `;
    }
}

function displayTrack(track) {
    const trackElement = document.getElementById('latest-track');
    trackElement.innerHTML = `
        <img src="${track.images[0].url}" alt="${track.name}" class="animate-fade">
        <h3>${track.name}</h3>
        <p>Lanzado: ${new Date(track.release_date).toLocaleDateString()}</p>
        <a href="${track.external_urls.spotify}" target="_blank" class="spotify-button">
            <i class="fab fa-spotify"></i> Escuchar en Spotify
        </a>
    `;
}

// Smooth scroll para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animación del menú al hacer scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.style.transform = 'translateY(0)';
        return;
    }
    
    if (currentScroll > lastScroll) {
        nav.style.transform = 'translateY(-100%)';
    } else {
        nav.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
});

// Cargar el último lanzamiento al iniciar la página
document.addEventListener('DOMContentLoaded', getLatestRelease);