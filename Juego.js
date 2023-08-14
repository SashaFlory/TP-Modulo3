// Cantidad de niveles: 20

// cuando se pasa de nivel
// 1-la velocidad de la pelota aumenta 10%
// 2-agregar un obstáculo de tamaño y posición random

// Atributos pensados en clase:
// nivel
// velocidad
// obstáculos

// Métodos pensados en clase:
// pasarNivel
// agregarObstaculo
// perder
// ganar

export default class Juego extends Phaser.Scene {
  constructor() {
    super("juego");
  }

  init() {
    this.nivel = 1;
    this.puntaje = 0;
    this.velocidad = 200;
  }

  preload() {
    this.load.image("pelota", "./public/images/Pelota.png");
    this.load.image("pala", "./public/images/Pala.png");
    this.load.image("obstaculo", "./public/images/Obstaculo.png");
  }

  create() {
    this.pelota = this.physics.add.image(400, 100, "pelota");
    this.pelota.setVelocity(this.velocidad, this.velocidad);
    this.pelota.setBounce(1, 1);
    this.pelota.setCollideWorldBounds(true);

    console.log("Velocidad:", this.velocidad);

    this.pala = this.physics.add.sprite(400, 500, "pala");
    this.pala.setCollideWorldBounds(true);
    this.pala.setImmovable(true);

    this.obstaculos = this.physics.add.staticGroup();

    this.physics.add.collider(this.pelota, this.obstaculos);
    this.physics.add.collider(this.pala, this.obstaculos);
    this.physics.add.collider(this.pelota, this.pala, this.sumarPuntos, null, this);

    this.textoNivel = this.add.text(15, 15, "Nivel: 1", {
      fontSize: "20px",
      fill: "#FFFFFF"
    });

    this.textoPuntos = this.add.text(15, 40, "Puntos: 0", {
      fontSize: "20px",
      fill: "#FFFFFF"
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.agregarObstaculo();

  }

  update() {
    if (this.cursors.up.isDown) {
      this.pala.setVelocityY(-300);
    } else if (this.cursors.down.isDown) {
      this.pala.setVelocityY(300);
    } else {
      this.pala.setVelocityY(0);
    }

    if (this.cursors.left.isDown) {
      this.pala.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.pala.setVelocityX(300);
    } else {
      this.pala.setVelocityX(0);
    }

  }

  sumarPuntos(pelota, pala) {
    this.puntaje++;

    this.textoPuntos.setText(
      "Puntos: " +
      this.puntaje
    );

    if (this.puntaje >= 5) {
      this.pasarNivel();
    }
  }

  pasarNivel() {
    this.nivel++
    console.log("Pasa a nivel:", this.nivel);
    this.textoNivel.setText(
      "Nivel: " +
      this.nivel
    )

    const randomColor = Phaser.Display.Color.RandomRGB(180, 50).color;
    this.cameras.main.setBackgroundColor(randomColor);

    this.velocidad = this.velocidad*1.1;
    console.log("Velocidad:", this.velocidad);
    this.pelota.setVelocity(this.velocidad, this.velocidad);
    
    this.puntaje = 0;
    this.textoPuntos.setText(
      "Puntos: " +
      this.puntaje
    );

    this.agregarObstaculo();
  }
  
  agregarObstaculo() {
    const randomX = Phaser.Math.RND.between(50, 750);
    const randomY = Phaser.Math.RND.between(100, 400);

    this.obstaculos.create(randomX, randomY, "obstaculo");
    console.log("nuevo obstáculo", randomX, randomY);
  }
}
