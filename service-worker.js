'use strict';

const CACHE_NAME = "ristoff-app-v1";

const FILES_TO_CACHE = [

    'icons/favicon.ico',
    'images/bg2.jpg',
    'images/logo.png',
    'images/offline.png',
    'css/styles.css',
    'css/bootstrap.min.css',
    'js/bootstrap.bundle.min.js',
    'js/app.js',
    'offline.html',
];

//Instalar Service Worker no Browser

self.addEventListener('install', (evt) => {

    console.log("Service Worker em instalação");

    evt.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            console.log("Service Worker fazendo o cache estático");
            return cache.addAll(FILES_TO_CACHE);
        })

    );
    self.skipWaiting();

});

//Ativando

self.addEventListener('activate', (evt) =>{

    console.log("Service Worker ativando");

    evt.waitUntil(

        caches.keys().then((keylist) => {

            return Promise.all(keylist.map((key) =>{

                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }

            }));

        })

    );
    self.clients.claim();
});

//Responder com a versão offline da app

self.addEventListener('fetch', (evt) => {

    if(evt.request.mode !== 'navigate'){

        return;
    }

    evt.respondWith(

        fetch(evt.request).catch(() => {
            return caches.open(CACHE_NAME).then((cache) => {
                return cache.match('offline.html');
            })
        })

    );


});