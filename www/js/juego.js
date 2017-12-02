var game;
var app={
  umbral: 75,
  nivel: 1,
  lluvia: null,
  antiSedentario: null,
  entrada: {},
  marcador: {},
  gameover: {},
  sonidos: {},
  iniciar: false,
  jugador: {
    volando: false,
    puntuacion: 0,
    fuselaje: 100
  },
  meteoritos: [],
  disparos: [],
  satelite: null,
  escudoOperativo: true,
  escudo: null,
  inicio: function(){
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  crearGameOver: function () {
    app.gameover.text1 = game.add.text(game.world.centerX, game.world.centerY - 40, "GAME");
    app.gameover.text1.anchor.set(0.5);
    app.gameover.text1.align = 'center';
    app.gameover.text1.font = 'Arial';
    app.gameover.text1.fontWeight = 'bold';
    app.gameover.text1.fontSize = 70;
    app.gameover.text1.fill = '#ffffff';
    app.gameover.text2 = game.add.text(game.world.centerX, game.world.centerY + 40, "OVER");
    app.gameover.text2.anchor.set(0.5);
    app.gameover.text2.align = 'center';
    app.gameover.text2.font = 'Arial';
    app.gameover.text2.fontWeight = 'bold';
    app.gameover.text2.fontSize = 70;
    app.gameover.text2.fill = '#ffffff';

    app.gameover.boton = game.add.button(game.world.centerX - 75, game.world.centerY + 100, 'botonReiniciar', app.reiniciarJuego, this, 2, 1, 0);
  },

  crearEntrada: function () {
    app.entrada.text = game.add.text(game.world.centerX, 100, "- SPACE -");
    app.entrada.text.anchor.set(0.5);
    app.entrada.text.align = 'center';
    app.entrada.text.font = 'Arial';
    app.entrada.text.fontWeight = 'bold';
    app.entrada.text.fontSize = 70;
    app.entrada.text.fill = '#ffffff';

    app.entrada.textReflect = game.add.text(game.world.centerX + 5, 145, "JAM");
    app.entrada.textReflect.anchor.set(0.5);
    app.entrada.textReflect.align = 'center';
    app.entrada.textReflect.scale.y = -1;
    app.entrada.textReflect.font = 'Arial';
    app.entrada.textReflect.fontWeight = 'bold';
    app.entrada.textReflect.fontSize = 70;
    var grd = app.entrada.textReflect.context.createLinearGradient(0, 0, 0, app.entrada.text.canvas.height);
    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(1, 'rgba(255,255,255,0.5)');
    app.entrada.textReflect.fill = grd;

    app.entrada.boton = game.add.button(game.world.centerX - 75, 225, 'botonJugar', app.iniciarJuego, this, 2, 1, 0);
  },

  crearMarcador() {
    app.marcador.fondo = game.add.sprite(0, 0, 'marcador');
    app.marcador.nameMini = game.add.sprite(10, 10, 'nave');
    app.marcador.meteoritoMini = game.add.sprite(2*game.world.width/6, 10, 'meteorito');
    app.marcador.lluviaMini = game.add.sprite(game.world.width - 75, 2, 'lluvia');
    app.marcador.escudoOn = game.add.sprite(2*game.world.width/6 - 26, 10, 'escudoOn');
    app.marcador.escudoOff = game.add.sprite(2*game.world.width/6 - 26, 10, 'escudoOff');
    app.marcador.escudoOff.alpha = 0;
    app.marcador.fondo.alpha = 0.5;
    app.marcador.nameMini.scale.x = 0.4;
    app.marcador.nameMini.scale.y = 0.4;
    app.marcador.meteoritoMini.scale.x = 0.2;
    app.marcador.meteoritoMini.scale.y = 0.2;
    app.marcador.lluviaMini.scale.x = 0.6;
    app.marcador.lluviaMini.scale.y = 0.6;     
    app.marcador.fuselaje = game.add.text(40, 10, app.jugador.fuselaje + '%', { fontSize: '20px', fill: '#ffffff' });
    app.marcador.puntuacion = game.add.text(2*game.world.width/6+35, 10, app.jugador.puntuacion, { fontSize: '20px', fill: '#ffffff' });
    app.marcador.record = game.add.text(3*game.world.width/6+40, 10, '('+localStorage.getItem('puntos')+')', { fontSize: '20px', fill: '#ffffff' });
    app.marcador.nivel = game.add.text(game.world.width - 30, 10, app.nivel, { fontSize: '20px', fill: '#ffffff' });
    app.marcador.galaxia = game.add.text(game.world.centerX - 135, 200, 'GALAXIA 1', { fontSize: '50px', fill: '#ffffff' });
  },

  iniciaJuego: function(){
    var platforms;

    if (!localStorage.getItem('puntos')) {
        localStorage.setItem('puntos','0');
    }

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      //imagenes
      game.load.image('marcador', 'assets/marcador.png');
      game.load.image('botonJugar', 'assets/jugar.png');
      game.load.image('botonReiniciar', 'assets/reiniciar.png');
      game.load.image('espacio', 'assets/espacio.png');
      game.load.image('planeta', 'assets/planeta.png');
      game.load.image('nave', 'assets/nave.png');
      game.load.image('meteorito', 'assets/meteorito.png');
      game.load.image('lluvia', 'assets/lluvia.png');
      game.load.image('escudo', 'assets/escudo.png');
      game.load.image('escudoOn', 'assets/escudoOn.png');
      game.load.image('escudoOff', 'assets/escudoOff.png');


      game.load.spritesheet('ovni', 'assets/naves.png', 62.5, 60, 16);
      game.load.spritesheet('satelite', 'assets/sat.png', 49.9, 50, 18);
      game.load.spritesheet('misil', 'assets/misil.png', 5, 25, 3);

      //sonidos
      game.load.audio('despegue', 'assets/audio/escape.mp3');
      game.load.audio('disparo', 'assets/audio/blaster.mp3');
      game.load.audio('explosion', 'assets/audio/explosion.mp3');
      game.load.audio('gameover', 'assets/audio/gameover.mp3');
      game.load.audio('reparacion', 'assets/audio/magical.mp3');
      game.load.audio('satelite', 'assets/audio/satelite.mp3');

    } 

    function create() {

      
      espacio = game.add.sprite(0, 0, 'espacio');
      espacio.height = game.world.height;
      espacio.width = game.world.width;
      

      app.crearEntrada();
      app.crearMarcador();
      app.crearGameOver();
      app.ocultarMarcador();
      app.ocultarGameOver();

      planeta = game.add.sprite(game.world.centerX - 125, game.world.height - 125, 'planeta');
      app.sonidos.despegue = game.add.audio('despegue');
      app.sonidos.disparo = game.add.audio('disparo');
      app.sonidos.explosion = game.add.audio('explosion');
      app.sonidos.gameover = game.add.audio('gameover');
      app.sonidos.reparacion = game.add.audio('reparacion');
      app.sonidos.satelite = game.add.audio('satelite');

      ovni = game.add.sprite(game.world.centerX - 18, game.world.height - 70, 'ovni');
      ovni.scale.x=0.1; 
      ovni.scale.y=0.1;
      ovni.animations.add('fly',[0,1,2,3,4,5,6,7]);
      ovni.animations.add('roto',[8,9,10,11,12,13,14,15]);
      

      game.physics.arcade.enable(ovni);
      game.physics.arcade.enable(planeta);

      ovni.body.collideWorldBounds = true;


    }

    function update(){


      
      //game.physics.arcade.overlap(ovni, objetivo, app.incrementaPuntuacion, null, this);
      //game.physics.arcade.collide(ovni, platforms);
      if(app.iniciar) {
          if (planeta.body.top > game.world.height) {
              app.iniciar = false;
              planeta.destroy();
              app.jugador.volando = true;
              planeta = null;
              app.lanzarMeteoritos(); 
          }
      }
           var factorDificultad = (300 + (dificultad * 100));
          ovni.body.velocity.y = (velocidadY * factorDificultad);
          ovni.body.velocity.x = (velocidadX * (-1 * factorDificultad));
          if (planeta) {
            if(app.iniciar) {
              ovni.scale.x=Math.min(1, ovni.scale.x + 0.05);
              ovni.scale.y=Math.min(1, ovni.scale.y + 0.05);
            }
              planeta.body.velocity.y = - (velocidadY * factorDificultad);
          }
          
            app.meteoritos.map( (meteorito, indice) => {
                meteorito.objeto.body.velocity.y += meteorito.velocidad;
                meteorito.objeto.body.velocity.x += meteorito.velocidadX;
                if (meteorito.objeto.body.top > game.world.height + 150) {
                  if (app.jugador.volando) {
                    app.actualizaPuntuacion(meteorito.objeto.scale.x);
                  }
                    meteorito.objeto.destroy();
                    app.meteoritos.splice(indice, 1);
                } else if (app.escudo) {
                  game.physics.arcade.overlap(app.escudo, app.meteoritos[indice].objeto, () => app.colisionEscudo(indice), null, this);
                } else if (app.jugador.volando) {
                  game.physics.arcade.overlap(ovni, app.meteoritos[indice].objeto, () => app.colision(indice), null, this);
                }
            });
            if (app.satelite){
              game.physics.arcade.overlap(ovni, app.satelite, () => app.reparaNave(), null, this);
            }
            app.disparos.map((disparo, indice) => {
              if (disparo.body.top < 0) {
                    disparo.destroy();
                    app.disparos.splice(indice, 1);
                } else if (app.jugador.volando) {
                  app.meteoritos.map( (meteorito, indiceM) => {
                      game.physics.arcade.overlap(disparo, meteorito.objeto, () => app.impactoDisparoMeteorito(disparo, meteorito.objeto, indice, indiceM), null, this);
                  });
                }
            });
    
        if (app.marcador.galaxia.alpha > 0.01) {
            app.marcador.galaxia.alpha -= 0.01;
        } else {
          app.marcador.galaxia.alpha = 0;
        }

        if (app.escudo) {
            app.escudo.position.x = ovni.position.x-20;
            app.escudo.position.y = ovni.position.y-20;
            game.world.bringToTop(app.escudo);
        }
    }

    app.iniciaHammer();
    var estados = { preload: preload, create: create, update: update };
    game = new Phaser.Game(ancho, alto, Phaser.AUTO, 'phaser',estados);
  },

  iniciarJuego: function() {
    app.ocultarEntrada();
    app.marcador.fuselaje.text = app.jugador.fuselaje + '%';
    app.marcador.puntuacion.text = app.jugador.puntuacion;
    app.marcador.nivel.text = app.nivel;
    app.marcador.galaxia.text = 'GALAXIA ' + app.nivel;
    app.marcador.galaxia.alpha=1;
    app.mostrarMarcador();
    app.sonido('despegue');
    ovni.animations.play('fly', 20, true);
    setTimeout(() => {
      app.iniciar = true;
      velocidadY = -1;
    },2000);
    app.prepararSatelite();
  },

  reiniciarJuego: function() {
    if (!game.paused) {
      return false;
    }
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    app.iniciar = false;
    app.nivel = 1;
    app.umbral = 75;
    app.meteoritos.map( (meteorito, indice) => {
            meteorito.objeto.destroy();
    });
    app.meteoritos = [];
    app.jugador.volando= false;
    app.jugador.puntuacion= 0;
    app.jugador.fuselaje= 100;
    ovni.destroy();
    planeta = game.add.sprite(game.world.centerX - 125, game.world.height - 125, 'planeta');
    game.physics.arcade.enable(planeta);
    ovni = game.add.sprite(game.world.centerX - 18, game.world.height - 70, 'ovni');
    ovni.animations.add('fly',[0,1,2,3,4,5,6,7]);
    ovni.animations.add('roto',[8,9,10,11,12,13,14,15]);
    ovni.scale.x=0.1; 
    ovni.scale.y=0.1;
    game.physics.arcade.enable(ovni);
    ovni.body.collideWorldBounds = true;
    app.ocultarGameOver();
    game.paused = false;
    app.iniciarJuego();
  },

  sonido: function(nombre) {
    app.sonidos[nombre].play();
  },

  ocultarGameOver: function() {
    for (let obj in app.gameover) {
      app.gameover[obj].visible = false;
    }

  },

  mostrarGameOver: function() {
    for (let obj in app.gameover) {
      app.gameover[obj].visible = true;
      game.world.bringToTop(app.gameover[obj]);
    }

  },

  ocultarEntrada: function() {
    for (let obj in app.entrada) {
      app.entrada[obj].visible = false;
    }

  },
  mostrarEntrada: function() {
    for (let obj in app.entrada) {
      app.entrada[obj].visible = true;
    }

  },

  ocultarMarcador: function() {
    for (let obj in app.marcador) {
      app.marcador[obj].visible = false;
    }

  },

  mostrarMarcador: function() {
    for (let obj in app.marcador) {
      app.marcador[obj].visible = true;
    }

  },

  colisionEscudo: function(indice) {
    app.sonido('explosion');
    app.meteoritos[indice].objeto.destroy();
    app.meteoritos.splice(indice, 1);
  },

  colision: function(indice) {
    app.sonido('explosion');
    app.actualizaFuselaje(app.meteoritos[indice].objeto.scale.x);
    app.meteoritos[indice].objeto.destroy();
    app.meteoritos.splice(indice, 1);
  },

  actualizaFuselaje: function(dano) {
    var gameOver=false;
    app.jugador.fuselaje = Math.round(app.jugador.fuselaje - dano * 50);
    if (app.jugador.fuselaje <= 0) {
        app.jugador.fuselaje = 0;
        gameOver=true;
    }
    app.marcador.fuselaje.text = app.jugador.fuselaje + '%';
    if (gameOver) {
      app.gameOver();
    }
  },

  reparaNave: function() {
    app.sonidos["satelite"].stop();
    app.sonido('reparacion');
    app.jugador.fuselaje = 100;
    app.marcador.fuselaje.text = app.jugador.fuselaje + '%';
    app.satelite.destroy();
    app.satelite = null;
  },

  lanzarSatelite: function() {
    if (!app.jugador.volando || game.paused) {
      return false;
    }
    app.sonido('satelite');
    setTimeout(function() {
        var x1,x2,y1,y2,dir;
        dir= Math.ceil(Math.random()*4);
        switch (dir) {
            case 1:
                x1 = Math.floor(Math.random() * game.world.width); 
                y1 = - 100;
                x2 = Math.floor(Math.random() * game.world.width); ;
                y2 = game.world.height + 100;
            break;
            case 2: 
                x1 = game.world.width + 100;
                y1 = Math.floor(Math.random() * game.world.height); 
                x2 = - 100;
                y2 = Math.floor(Math.random() * game.world.height); ;
            break;
            case 3: 
                x1 = Math.floor(Math.random() * game.world.width); 
                y1 = game.world.height + 100;
                x2 = Math.floor(Math.random() * game.world.width); ;
                y2 = - 100;
            break;
            case 4: 
                x1 = - 100;
                y1 = Math.floor(Math.random() * game.world.height); 
                x2 = game.world.width + 100;
                y2 = Math.floor(Math.random() * game.world.height); ;
            break;
        }
        app.satelite = game.add.sprite(x1, y1, 'satelite');
        app.satelite.animations.add('orbita');
        app.satelite.animations.play('orbita', 20, true);
        game.physics.arcade.enable(app.satelite);
        game.physics.arcade.moveToXY(app.satelite,x2,y2,0,3000);
        setTimeout(function() {
            app.satelite.destroy();
            app.satelite = null;
            app.prepararSatelite();
        },3000);
    },2000);
  },

  prepararSatelite: function() {
      var t = Math.round(Math.random()*60)/app.nivel+30/app.nivel;
      setTimeout(() => app.lanzarSatelite(),t*1000);
  },

  actualizaPuntuacion: function(peso) {
    app.jugador.puntuacion += Math.round(peso*10);
    app.marcador.puntuacion.text = app.jugador.puntuacion;
    if (app.jugador.puntuacion >= app.umbral) {
        clearInterval(app.lluvia);
        app.nivel++;
        app.marcador.nivel.text = app.nivel;
        app.umbral *=2;
        app.marcador.galaxia.text = 'GALAXIA ' + app.nivel;
        app.marcador.galaxia.alpha = 1;
        app.lanzarMeteoritos();
    }
  },

  gameOver: function() {
      clearInterval(app.antiSedentario);
      clearInterval(app.lluvia);
      app.jugador.volando=false;
      ovni.animations.play('roto', 20, false);
      app.sonido('gameover');
      if (parseInt(localStorage.getItem('puntos'))<app.jugador.puntuacion) {
          localStorage.setItem('puntos',app.jugador.puntuacion);
          app.marcador.record.text = '('+app.jugador.puntuacion+')';
      }
    setTimeout(()=> {
      app.mostrarGameOver();
      setTimeout(()=> game.paused = true,1200);
    },1100);
  },

  jugadorDispara: function() {
    if (app.jugador.volando) {
      var disparo;
      app.sonido('disparo');
      disparo = game.add.sprite(ovni.position.x+27, ovni.position.y, 'misil');
      game.physics.arcade.enable(disparo);
      disparo.animations.add('fuego');
      disparo.animations.play('fuego', 20, true);
      game.physics.arcade.moveToXY(disparo,ovni.position.x+27,-20,0,500);
      app.disparos.push(disparo);
    } 
  },

  impactoDisparoMeteorito: function(disparo, meteorito, indiceD, indiceM) {
    app.actualizaPuntuacion(1);
    disparo.destroy();
    app.disparos.splice(indiceD, 1);
    if (app.meteoritos[indiceM].escala >= 0.2) {
        app.meteoritos.push({
          objeto: game.add.sprite(meteorito.position.x, meteorito.position.y, 'meteorito'),
          velocidad: app.meteoritos[indiceM].velocidad,
          velocidadX: -1,
          escala: app.meteoritos[indiceM].escala / 2
        });
        app.meteoritos[app.meteoritos.length-1].objeto.scale.x = app.meteoritos[app.meteoritos.length-1].escala;
        app.meteoritos[app.meteoritos.length-1].objeto.scale.y = app.meteoritos[app.meteoritos.length-1].escala;
        game.physics.arcade.enable(app.meteoritos[app.meteoritos.length-1].objeto);
        app.meteoritos.push({
          objeto: game.add.sprite(meteorito.position.x, meteorito.position.y, 'meteorito'),
          velocidad: app.meteoritos[indiceM].velocidad,
          velocidadX: 1,
          escala: app.meteoritos[indiceM].escala / 2
        });    
        app.meteoritos[app.meteoritos.length-1].objeto.scale.x = app.meteoritos[app.meteoritos.length-1].escala;
        app.meteoritos[app.meteoritos.length-1].objeto.scale.y = app.meteoritos[app.meteoritos.length-1].escala;
        game.physics.arcade.enable(app.meteoritos[app.meteoritos.length-1].objeto);
        game.world.bringToTop(ovni);
    }
    meteorito.destroy();
    app.meteoritos.splice(indiceM, 1);
  },

  lanzarMeteoritos: function() { 
   app.lluvia = setInterval(function() {
     if (!game.paused) {
        app.meteoritos.push({
          objeto: game.add.sprite(app.inicioX(), app.inicioY(), 'meteorito'),
          velocidad: Math.floor(Math.random() * app.nivel * 1.5),
          velocidadX: 0,
          escala: Math.ceil(Math.random() * app.nivel) / 15
        });
        app.meteoritos[app.meteoritos.length-1].objeto.scale.x = app.meteoritos[app.meteoritos.length-1].escala;
        app.meteoritos[app.meteoritos.length-1].objeto.scale.y = app.meteoritos[app.meteoritos.length-1].escala;
        game.physics.arcade.enable(app.meteoritos[app.meteoritos.length-1].objeto);
        game.world.bringToTop(ovni);
      }
    },2000/app.nivel);
    app.antiSedentario = setInterval(function() {
      if (!game.paused) {
        app.meteoritos.push({
          objeto: game.add.sprite(ovni.position.x+10, app.inicioY(), 'meteorito'),
          velocidad: Math.floor(Math.random() * app.nivel * 1.5),
          velocidadX: 0,
          escala: Math.ceil(Math.random() * app.nivel) / 15
        });
        app.meteoritos[app.meteoritos.length-1].objeto.scale.x = app.meteoritos[app.meteoritos.length-1].escala;
        app.meteoritos[app.meteoritos.length-1].objeto.scale.y = app.meteoritos[app.meteoritos.length-1].escala;
        game.physics.arcade.enable(app.meteoritos[app.meteoritos.length-1].objeto);
        game.world.bringToTop(ovni);        
      }
    },3000*app.nivel);
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - 40 );
  },

  inicioY: function(){
    return -200 - app.numeroAleatorioHasta(300 );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      if (app.jugador.volando) {
        app.detectaAgitacion(datosAceleracion);
        app.registraDireccion(datosAceleracion);
      }
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      //setTimeout(app.recomienza, 1000);
      game.paused = true;
      document.querySelector('.opciones').style.display='flex';
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadY = datosAceleracion.y;
    velocidadX = datosAceleracion.x ;
    
  },

  ponerEscudo: function() {
      if (app.escudoOperativo && !app.escudo) {
        app.escudo =  game.add.sprite(ovni.position.x-20, ovni.position.y-20, 'escudo');
        game.physics.arcade.enable(app.escudo);   
      }
      setTimeout(app.quitarEscudo, 10000);
  },

  quitarEscudo: function() {
    app.escudo.destroy();
    app.escudo=null;
    app.escudoOperativo = false;
    app.marcador.escudoOn.alpha= 0;
    app.marcador.escudoOff.alpha=1;
    setTimeout(app.escudoDisponible, 60000);
  },

  escudoDisponible: function() {
    app.escudoOperativo = true;
    app.marcador.escudoOn.alpha= 1;
    app.marcador.escudoOff.alpha=0;
  },

    iniciaHammer: function() {
    var zona = document.getElementById('phaser');
    var hammertime = new Hammer(zona);
    
    hammertime.get('rotate').set({ enable: true });

    hammertime.on('rotate', function(ev) {
      if (ev.distance > 25) {
        app.ponerEscudo(); 
      }
    });
  },

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
    document.querySelector('#phaser').addEventListener('click',app.jugadorDispara,false); 
    document.querySelector('#borrarRecord').addEventListener('click',function(){
        localStorage.setItem('puntos','0');
        app.marcador.record.text = '(0)';
        document.querySelector('.opciones').style.display='none';
        game.paused = false;
    },false); 
    document.querySelector('#cancel').addEventListener('click',function(){
        document.querySelector('.opciones').style.display='none';
        game.paused = false;
    },false); 
}