const Perfil = require("../models/perfiles");

module.exports.delete = {
  handler: function (req, reply) {
    if (!req.params.id) {
      return reply({ err: "id es un parámetro requerido" }).code(400);
    }
    if (req.params.eliminar === "true") {
      Perfil.findByIdAndDelete(req.params.id, err => {
        if (err) {
          return reply.response({ err });
        }
        return reply.response({
          msg: `Perfil con id ${req.params.id} eliminado`
        });
      });
    } else {
      Perfil.findByIdAndUpdate(
        req.params.id,
        { $set: { inactivo: true } },
        { new: true },
        err => {
          if (err) {
            return reply.response({ err });
          }
          return reply.response({
            msg: `Perfil con id ${req.params.id} esta ahora inactivo`
          });
        }
      );
    }
  }
};

module.exports.create = {
  handler: function (req, reply) {
    let payload = req.payload;
    try {
      payload = JSON.parse(req.payload);
    } catch (e) {
      payload = req.payload;
    }
    if (!payload.nombre) {
      return reply({ er: "nombre es requirido" }).code(400);
    }

    if (!payload.categorias) {
      return reply({ er: "requiere al menos una categoria" }).code(400);
    }

    if (!payload.busquedas) {
      return reply({ er: "requiere al menos una busqueda" }).code(400);
    }

    Perfil.create(
      {
        nombre: payload.nombre,
        categorias: payload.categorias,
        busquedas: payload.busquedas,
        inactivo: false
      },
      err => {
        if (err) {
          return reply(err).code(500);
        }
        return reply.response({ msg: "Perfil creado con exito" });
      }
    );
  }
};

module.exports.update = {
  handler: function (req, reply) {
    if (!req.params.id) {
      return reply.response({ err: "id es un parámetro requerido" });
    }

    Perfil.findById(req.params.id, (findByIdErr, perfil) => {
      if (findByIdErr) {
        return reply.response({ findByIdErr });
      }

      if (perfil.inactivo) {
        return reply.response({ err: "No existe el perfil" });
      } else {
        Perfil.find({ nombre: req.payload.nombre }, (findErr, docs) => {
          if (findErr) {
            return reply.response({ findErr });
          }

          if (docs.length > 0) {
            return reply.response({ err: "El nombre ya existe" });
          } else {
            let attributes = {};

            if (req.payload.nombre) {
              attributes.nombre = req.payload.nombre;
            }

            if (req.payload.categorias) {
              if (req.payload.categorias.length < 1) {
                return reply.response({
                  err: "Debe de seleccionar al menos una categoría"
                });
              }

              attributes.categorias = req.payload.categorias;
            }

            if (req.payload.busquedas) {
              if (req.payload.busquedas.length < 1) {
                return reply.response({
                  err: "Debe de tener al menos un criterio de búsqueda"
                });
              }

              attributes.busquedas = req.payload.busquedas;
            }

            if (req.payload.inactivo) {
              attributes.inactivo = req.payload.inactivo;
            }

            Perfil.findByIdAndUpdate(
              req.params.id,
              attributes,
              { new: true },
              (err, perfil) => {
                if (err) {
                  return reply(err).code(500);
                }

                return reply.response(perfil);
              }
            );
          }
        });
      }
    });
  }
};

module.exports.searchById = {
  handler: function (req, reply) {
    if (!req.params.id) {
      return reply.response({ err: "id es un parámetro requerido" });
    }

    Perfil.findById(req.params.id, (findByIdErr, perfil) => {
      if (findByIdErr) {
        return reply.response({ findByIdErr });
      }

      if (perfil.inactivo) {
        return reply.response({ err: "No existe el perfil" });
      } else {
        Perfil.find({ nombre: req.payload.nombre }, (findErr) => {
          if (findErr) {
            return reply.response({ findErr });
          }
          let attributes = {};

          if (req.payload.nombre) {
            attributes.nombre = req.payload.nombre;
            attributes.categorias = req.payload.categorias;
            attributes.busquedas = req.payload.busquedas;
            attributes.inactivo = req.payload.inactivo;
          }

          Perfil.search(
            req.params.id,
            attributes,
            (err, perfil) => {
              if (err) {
                return reply(err).code(500);
              }

              return reply.response(perfil);
            }
          );
        });
      }
    });
  }
};

module.exports.find = {
  handler: function (req, reply) {
    Perfil.find({ inactivo: false }, "id nombre", (err, perfiles) => {
      if (err) {
        return reply.response({ err });
      }
      return reply.response(perfiles);
    });
  }
};
