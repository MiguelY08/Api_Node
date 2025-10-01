class Usuario {
    constructor ({ idUsuario, nombre, email, password, rol }) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.createdAt = new Date();
    }
}

export default Usuario;