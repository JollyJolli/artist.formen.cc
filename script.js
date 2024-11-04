// script.js
const SPOTIFY_TOKEN = 'BQCDUSkvMdby9TqkSYEYP8hPew75P76HUc8qb8c9c5jnSAnItZ5KK6eb5Wg51UdqG1Lvggs9XgZrPEl6OvJetLIYTq4wOYSkDSKQ9rtgyCVyppwatNOf-xbsaL_uULpUU2aqnXHbG5DgOwoM8TbumOKEgHpRo5qt9r6IzdEd9JFGiiCL0WJ6SrSGUVvO2UeVc-GFXlc22AgoMNPO0QWnjWeMGY1QiElTqSEf5ZeZnLYMXu8e0Rm1akGFkfUHZQoCztUDKwKXHNboZ0XykmJx8gePTIN0Dd2K';
const ARTIST_ID = '0O202ZSWYbhYQZqpmd4y8d';

// Cursor personalizado
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
});

// Menú móvil
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    mobileMenu.classList.toggle('active');
});

// Animación de aparición al scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('h2, .reveal-text').forEach(el => observer.observe(el));

// Funciones de Spotify API
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
            <p class="error-message">Error al cargar el último lanzamiento.</p>
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

async function getTopTracks() {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}/top-tracks?market=ES`, {
            headers: {
                'Authorization': `Bearer ${SPOTIFY_TOKEN}`
            }
        });
        
        const data = await response.json();
        if (data.tracks) {
            displayTopTracks(data.tracks.slice(0, 6));
        }
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        document.getElementById('top-tracks').innerHTML = `
            <p class="error-message">Error al cargar las canciones más populares.</p>
        `;
    }
}

function displayTopTracks(tracks) {
    const tracksContainer = document.getElementById('top-tracks');
    tracksContainer.innerHTML = tracks.map(track => `
        <div class="track-card">
            <img src="${track.album.images[0].url}" alt="${track.name}">
            <h3>${track.name}</h3>
            <p>${track.album.name}</p>
            <a href="${track.external_urls.spotify}" target="_blank" class="spotify-button">
                <i class="fab fa-spotify"></i> Reproducir
            </a>
        </div>
    `).join('');
}

async function getArtistStats() {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}`, {
            headers: {
                'Authorization': `Bearer ${SPOTIFY_TOKEN}`
            }
        });
        
        const data = await response.json();
        document.getElementById('monthly-listeners').textContent = data.followers.total.toLocaleString();
        document.getElementById('followers').textContent = data.followers.total.toLocaleString();
    } catch (error) {
        console.error('Error fetching artist stats:', error);
    }
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('open');
        
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

// Inicializar todo cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    getLatestRelease();
    getTopTracks();
    getArtistStats();
});

// Efecto hover en links
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    link.addEventListener('mouseleave', () => {
        cursorFollower.style.transform = 'scale(1)';
    });
});