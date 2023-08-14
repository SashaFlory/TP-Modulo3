export default class Juego extends Phaser.Scene {
  constructor() {
    super("juego");
  }

  init() {
    this.nivel = 1;
    this.puntaje = 0;
    this.velocidad = 200;
    this.bordeInferior = 570;
  }

  preload() {
    this.load.image("pelota", "./public/images/Pelota.png");
    this.load.image("pala", "./public/images/Pala.png");
    this.load.image("obstaculo", "./public/images/Obstaculo.png");
    this.load.image("ganador", "./public/images/Ganador.png");
    this.load.image("perdedor", "./public/images/Perdedor.png");
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

    if (this.pelota.y > this.bordeInferior) {
      this.perder();
    }
  }

  sumarPuntos(pelota, pala) {
    this.puntaje++;

    this.textoPuntos.setText(
      "Puntos: " +
      this.puntaje
    );

    if (this.puntaje >= 10) {
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

    if (this.nivel >= 20) {
      this.ganador = this.add.image(400, 300, "ganador");
      this.scene.pause();
    }
  }
  
  agregarObstaculo() {
    const randomX = Phaser.Math.RND.between(50, 750);
    const randomY = Phaser.Math.RND.between(100, 400);
    const randomSize = Phaser.Math.RND.between(0.8, 1.6);

    this.obstaculos.create(randomX, randomY, "obstaculo").setScale(randomSize).refreshBody();
    console.log("nuevo obstáculo", randomX, randomY);
  }

  perder() {
    this.add.image(0, 0, "perdedor").setOrigin(0);
    this.scene.pause();
  }
}
