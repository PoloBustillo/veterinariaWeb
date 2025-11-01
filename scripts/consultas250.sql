-- 41 Queries de Caja
select * from "Caja";
select id_caja  from "Caja";
select fecha_apertura from "Caja";
select fecha_cierre from "Caja";
select saldo_inicial from "Caja";
select saldo_final from "Caja";
select observaciones from "Caja";
select id_caja, fecha_apertura from "Caja";
select id_caja, fecha_cierre from "Caja";
select id_caja, saldo_inicial from "Caja";
select id_caja, saldo_final from "Caja";
select id_caja, observaciones from "Caja";
select fecha_apertura, fecha_cierre from "Caja";
select fecha_apertura, saldo_inicial from "Caja";
select fecha_apertura, saldo_final from "Caja";
select fecha_apertura, observaciones from "Caja";
select fecha_cierre, saldo_inicial from "Caja";
select fecha_cierre, saldo_final from "Caja";
select fecha_cierre, observaciones from "Caja";
select saldo_inicial, saldo_final from "Caja"; 
select saldo_inicial, observaciones from "Caja";
select saldo_final, observaciones from "Caja";
select id_caja, fecha_apertura, fecha_cierre from "Caja";
select id_caja, fecha_apertura, saldo_inicial from "Caja";
select id_caja, fecha_apertura, saldo_final from "Caja";
select id_caja, fecha_apertura, observaciones from "Caja";
select id_caja, fecha_cierre, saldo_inicial from "Caja";
select id_caja, fecha_cierre, saldo_final from "Caja";
select id_caja, fecha_cierre, observaciones from "Caja";
select id_caja, saldo_inicial, saldo_final from "Caja"; 
select id_caja, saldo_inicial, observaciones from "Caja";
select id_caja, saldo_final, observaciones from "Caja";
select fecha_apertura, fecha_cierre, saldo_inicial from "Caja";
select fecha_apertura, fecha_cierre, saldo_final from "Caja";
select fecha_apertura, fecha_cierre, observaciones from "Caja";
select fecha_apertura, saldo_inicial, saldo_final from "Caja";
select fecha_apertura, saldo_inicial, observaciones from "Caja";
select fecha_apertura, saldo_final, observaciones from "Caja";
select fecha_cierre, saldo_inicial, saldo_final from "Caja";
select fecha_cierre, saldo_inicial, observaciones from "Caja";
select fecha_cierre, saldo_final, observaciones from "Caja"; --41



select * from "Caja_Movimiento";


-- 74 Queries de Consulta
select * from "Consulta";
select id_consulta from "Consulta";
select id_mascota from "Consulta";
select id_veterinario from "Consulta";
select fecha from "Consulta";
select motivo from "Consulta";
select diagnostico from "Consulta";
select tratamiento from "Consulta";
select estado from "Consulta";
select observaciones from "Consulta";
select id_consulta, id_mascota from "Consulta";
select id_consulta, id_veterinario from "Consulta";
select id_consulta, fecha from "Consulta";
select id_consulta, motivo from "Consulta";
select id_consulta, diagnostico from "Consulta";
select id_consulta, tratamiento from "Consulta";
select id_consulta, estado from "Consulta";
select id_consulta, observaciones from "Consulta";
select id_mascota, id_veterinario from "Consulta";
select id_mascota, fecha from "Consulta";
select id_mascota, motivo from "Consulta";
select id_mascota, diagnostico from "Consulta";
select id_mascota, tratamiento from "Consulta";
select id_mascota, estado from "Consulta";
select id_mascota, observaciones from "Consulta";
select id_veterinario, fecha from "Consulta";
select id_veterinario, motivo from "Consulta";
select id_veterinario, diagnostico from "Consulta";
select id_veterinario, tratamiento from "Consulta";
select id_veterinario, estado from "Consulta";
select id_veterinario, observaciones from "Consulta";
select fecha, motivo from "Consulta";
select fecha, diagnostico from "Consulta";
select fecha, tratamiento from "Consulta";
select fecha, estado from "Consulta";
select fecha, observaciones from "Consulta";
select motivo, diagnostico from "Consulta";
select motivo, tratamiento from "Consulta";
select motivo, estado from "Consulta";
select motivo, observaciones from "Consulta";
select diagnostico, tratamiento from "Consulta";
select diagnostico, estado from "Consulta";
select diagnostico, observaciones from "Consulta";
select tratamiento, estado from "Consulta";
select tratamiento, observaciones from "Consulta";
select estado, observaciones from "Consulta";
select id_consulta, id_mascota, id_veterinario from "Consulta";
select id_consulta, id_mascota, fecha from "Consulta";
select id_consulta, id_mascota, motivo from "Consulta";
select id_consulta, id_mascota, diagnostico from "Consulta";
select id_consulta, id_mascota, tratamiento from "Consulta";
select id_consulta, id_mascota, estado from "Consulta";
select id_consulta, id_mascota, observaciones from "Consulta";
select id_consulta, id_veterinario, fecha from "Consulta";
select id_consulta, id_veterinario, motivo from "Consulta";
select id_consulta, id_veterinario, diagnostico from "Consulta";
select id_consulta, id_veterinario, tratamiento from "Consulta";
select id_consulta, id_veterinario, estado from "Consulta";
select id_consulta, id_veterinario, observaciones from "Consulta";
select id_consulta, fecha, motivo from "Consulta"; 
select id_consulta, fecha, diagnostico from "Consulta";
select id_consulta, fecha, tratamiento from "Consulta";
select id_consulta, fecha, estado from "Consulta";
select id_consulta, fecha, observaciones from "Consulta";
select id_consulta, motivo, diagnostico from "Consulta";
select id_consulta, motivo, tratamiento from "Consulta";
select id_consulta, motivo, estado from "Consulta";
select id_consulta, motivo, observaciones from "Consulta";
select id_consulta, diagnostico, tratamiento from "Consulta";
select id_consulta, diagnostico, estado from "Consulta"; 
select id_consulta, diagnostico, observaciones from "Consulta";
select id_consulta, tratamiento, estado from "Consulta";
select id_consulta, tratamiento, observaciones from "Consulta";
select id_consulta, estado, observaciones from "Consulta"; -- 74
 

select * from "Consulta_Insumo";


select * from "Consulta_Servicio";


-- 41 Queries de Dueno
select * from "Dueno";
select id_dueno from "Dueno";
select telefono from "Dueno";
select correo from "Dueno";
select direccion from "Dueno";
select fecha_registro from "Dueno";
select activo from "Dueno";
select id_dueno, telefono from "Dueno";
select id_dueno, correo from "Dueno";
select id_dueno, direccion from "Dueno";
select id_dueno, fecha_registro from "Dueno";
select id_dueno, activo from "Dueno";
select telefono, correo from "Dueno";
select telefono, direccion from "Dueno";
select telefono, fecha_registro from "Dueno";
select telefono, activo from "Dueno";
select correo, direccion from "Dueno";
select correo, fecha_registro from "Dueno";
select correo, activo from "Dueno";
select direccion, fecha_registro from "Dueno";
select direccion, activo from "Dueno";
select fecha_registro, activo from "Dueno";
select id_dueno, telefono, correo from "Dueno";
select id_dueno, telefono, direccion from "Dueno";
select id_dueno, telefono, fecha_registro from "Dueno";
select id_dueno, telefono, activo from "Dueno";
select id_dueno, correo, direccion from "Dueno";
select id_dueno, correo, fecha_registro from "Dueno";
select id_dueno, correo, activo from "Dueno";
select id_dueno, direccion, fecha_registro from "Dueno";
select id_dueno, direccion, activo from "Dueno";
select id_dueno, fecha_registro, activo from "Dueno";
select telefono, correo, direccion from "Dueno";
select telefono, correo, fecha_registro from "Dueno";
select telefono, correo, activo from "Dueno";
select telefono, direccion, fecha_registro from "Dueno";
select telefono, direccion, activo from "Dueno";
select telefono, fecha_registro, activo from "Dueno";
select correo, direccion, fecha_registro from "Dueno";
select correo, direccion, activo from "Dueno";
select direccion, fecha_registro, activo from "Dueno"; -- 41

select * from "Dueno_Facturacion";

-- 62 Queries de Insumo
select * from "Insumo";
select id_insumo from "Insumo";
select nombre from "Insumo";
select descripcion from "Insumo";
select unidad from "Insumo";
select cantidad_disponible from "Insumo";
select costo_unitario from "Insumo";
select fecha_registro from "Insumo";
select id_insumo, nombre from "Insumo";
select id_insumo, descripcion from "Insumo";
select id_insumo, unidad from "Insumo";
select id_insumo, cantidad_disponible from "Insumo";
select id_insumo, costo_unitario from "Insumo";
select id_insumo, fecha_registro from "Insumo";
select nombre, descripcion from "Insumo";
select nombre, unidad from "Insumo";
select nombre, cantidad_disponible from "Insumo";
select nombre, costo_unitario from "Insumo";
select nombre, fecha_registro from "Insumo";
select descripcion, unidad from "Insumo";
select descripcion, cantidad_disponible from "Insumo";
select descripcion, costo_unitario from "Insumo";
select descripcion, fecha_registro from "Insumo";
select unidad, cantidad_disponible from "Insumo";
select unidad, costo_unitario from "Insumo";
select unidad, fecha_registro from "Insumo";
select cantidad_disponible, costo_unitario from "Insumo";
select cantidad_disponible, fecha_registro from "Insumo";
select id_insumo, nombre, descripcion from "Insumo";
select id_insumo, nombre, unidad from "Insumo";
select id_insumo, nombre, cantidad_disponible from "Insumo";
select id_insumo, nombre, costo_unitario from "Insumo";
select id_insumo, nombre, fecha_registro from "Insumo";
select id_insumo, descripcion, unidad from "Insumo";
select id_insumo, descripcion, cantidad_disponible from "Insumo";
select id_insumo, descripcion, costo_unitario from "Insumo";
select id_insumo, descripcion, fecha_registro from "Insumo";
select id_insumo, unidad, cantidad_disponible from "Insumo";
select id_insumo, unidad, costo_unitario from "Insumo";
select id_insumo, unidad, fecha_registro from "Insumo";
select id_insumo, cantidad_disponible, costo_unitario from "Insumo";
select id_insumo, cantidad_disponible, fecha_registro from "Insumo";
select id_insumo, costo_unitario, fecha_registro from "Insumo";
select nombre, descripcion, unidad from "Insumo";
select nombre, descripcion, cantidad_disponible from "Insumo";
select nombre, descripcion, costo_unitario from "Insumo";
select nombre, descripcion, fecha_registro from "Insumo";
select nombre, unidad, cantidad_disponible from "Insumo";
select nombre, unidad, costo_unitario from "Insumo";
select nombre, unidad, fecha_registro from "Insumo";
select nombre, cantidad_disponible, costo_unitario from "Insumo";
select nombre, cantidad_disponible, fecha_registro from "Insumo";
select nombre, costo_unitario, fecha_registro from "Insumo";
select descripcion, unidad, cantidad_disponible from "Insumo";
select descripcion, unidad, costo_unitario from "Insumo";
select descripcion, unidad, fecha_registro from "Insumo";
select descripcion, cantidad_disponible, costo_unitario from "Insumo";
select descripcion, cantidad_disponible, fecha_registro from "Insumo";
select descripcion, costo_unitario, fecha_registro from "Insumo";
select unidad, cantidad_disponible, costo_unitario from "Insumo";
select unidad, cantidad_disponible, fecha_registro from "Insumo";
select cantidad_disponible, costo_unitario,fecha_registro from "Insumo"; -- 62

-- 78 Queries de Mascota
select * from "Mascota";
select id_mascota from "Mascota";
select nombre from "Mascota";
select especie from "Mascota";
select raza from "Mascota";
select fecha_nacimiento from "Mascota";
select sexo from "Mascota";
select color from "Mascota";
select senias_particulares from "Mascota";
select id_mascota, nombre from "Mascota";
select id_mascota, especie from "Mascota";
select id_mascota, raza from "Mascota";
select id_mascota, fecha_nacimiento from "Mascota";
select id_mascota, sexo from "Mascota";
select id_mascota, color from "Mascota";
select id_mascota, senias_particulares from "Mascota";
select nombre, especie from "Mascota";
select nombre, raza from "Mascota";
select nombre, fecha_nacimiento from "Mascota";
select nombre, sexo from "Mascota";
select nombre, color from "Mascota";
select nombre, senias_particulares from "Mascota";
select especie, raza from "Mascota";
select especie, fecha_nacimiento from "Mascota";
select especie, sexo from "Mascota";
select especie, color from "Mascota";
select especie, senias_particulares from "Mascota";
select raza, fecha_nacimiento from "Mascota";
select raza, sexo from "Mascota";
select raza, color from "Mascota";
select raza, senias_particulares from "Mascota";
select fecha_nacimiento, sexo from "Mascota";
select fecha_nacimiento, color from "Mascota";
select fecha_nacimiento, senias_particulares from "Mascota";
select sexo, color from "Mascota";
select sexo, senias_particulares from "Mascota";
select color, senias_particulares from "Mascota";
select id_mascota, nombre, especie from "Mascota";
select id_mascota, nombre, raza from "Mascota";
select id_mascota, nombre, fecha_nacimiento from "Mascota";
select id_mascota, nombre, sexo from "Mascota";
select id_mascota, nombre, color from "Mascota";
select id_mascota, nombre, senias_particulares from "Mascota";
select nombre, especie, raza from "Mascota";
select nombre, especie, fecha_nacimiento from "Mascota";
select nombre, especie, sexo from "Mascota";
select nombre, especie, color from "Mascota";
select nombre, especie, senias_particulares from "Mascota";
select nombre, raza, fecha_nacimiento from "Mascota";
select nombre, raza, sexo from "Mascota";
select nombre, raza, color from "Mascota";
select nombre, raza, senias_particulares from "Mascota";
select nombre, fecha_nacimiento, sexo from "Mascota";
select nombre, fecha_nacimiento, color from "Mascota";
select nombre, fecha_nacimiento, senias_particulares from "Mascota";
select nombre, sexo, color from "Mascota";
select nombre, sexo, senias_particulares from "Mascota";
select nombre, color, senias_particulares from "Mascota";
select especie, raza, fecha_nacimiento from "Mascota";
select especie, raza, sexo from "Mascota";
select especie, raza, color from "Mascota";
select especie, raza, senias_particulares from "Mascota";
select especie, fecha_nacimiento, sexo from "Mascota";
select especie, fecha_nacimiento, color from "Mascota";
select especie, fecha_nacimiento, senias_particulares from "Mascota";
select especie, sexo, color from "Mascota";
select especie, sexo, senias_particulares from "Mascota";
select especie, color, senias_particulares from "Mascota";
select raza, fecha_nacimiento, sexo from "Mascota";
select raza, fecha_nacimiento, color from "Mascota";
select raza, fecha_nacimiento, senias_particulares from "Mascota";
select raza, sexo, color from "Mascota";
select raza, sexo, senias_particulares from "Mascota";
select raza, color, senias_particulares from "Mascota";
select fecha_nacimiento, sexo, color from "Mascota";
select fecha_nacimiento, sexo, senias_particulares from "Mascota";
select fecha_nacimiento, color, senias_particulares from "Mascota";
select sexo, color, senias_particulares from "Mascota"; -- 78

select * from "Movimiento";


select * from "Movimiento_Insumo";


select * from "Pago";


select * from "Producto";


select * from "Relacion_Dueno_Mascota";


select * from "Servicio";


select * from "Venta_Producto";


select * from "Veterinario";














