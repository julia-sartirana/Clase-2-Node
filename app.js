const express = require('express');
const fs = require('fs')
const app = express();

app.use(express.json()); // para tener el body en la consola

app.get('/', (req, res) => {
	/* res.send('Bienvenido a mi API') */
	res.json({
		Estado: 'Bienvenido a mi API'
	});
});

app.get('/gatitos', (req, res) => {
	fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => {
		const dataJSON = JSON.parse(data)
		res.json({
			status: 'success',
			data: dataJSON,
		});
	});   
}); 

app.get('/gatitos/:id', (req, res) => {
	fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => {
			
		if(err) {
			return res.status(500).json({
				status: 'error',
				message: 'Ocurrio un error'
			});
		}
		const gatos = JSON.parse(data);
		const id = Number(req.params.id);
		const gatosFiltrados = gatos.filter(gato => gato.id === id)
		
		if (!gatosFiltrados.length) {
			return res.status(404).json({
				status: 'fail',
				message: 'Gato no encontrado'
			})
		}
		res.json({
			status: 'success',
			data: gatosFiltrados
		})
	});
});

app.post('/gatitos', (req, res) => {
  /* console.log(req.body) */
	fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => {
		const dataJSON = JSON.parse(data);
		const nuevoGato = req.body;
		nuevoGato.id = dataJSON.length
		dataJSON.push(nuevoGato)

		fs.writeFile(`${__dirname}/assets/cats.json`, JSON.stringify(dataJSON), err => {
		
			res.status(201).json({
				status: 'success',
				data: {
						nuevoGato,
						createAt: new Date()
				}
			});
		});
	});
});

app.put("/gatitos/:id", (req, res) => {
  fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => {
    const dataJSON = JSON.parse(data);
    const nuevoGato = req.body;
    const id = Number(req.params.id);

    if (dataJSON.map((gatito) => gatito.id).includes(id)) {
      fs.writeFile(
        `${__dirname}/assets/cats.json`,
        JSON.stringify(dataJSON),
        (err) => {
          const i = dataJSON.map((gatito) => gatito.id).indexOf(id);

          const nuevoGatoId = { id: id, ...nuevoGato };
          dataJSON.splice(i, 1, nuevoGatoId);

          res.json({
            status: "Success",
            data: nuevoGatoId,
          });
        }
      );
    } else {
      res.status(404).json({
        status: "fail",
        message: "Gato no encontrado",
      });
    }
  });
});

app.delete("/gatitos/:id", (req, res) => {
	fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => {
		const dataJSON = JSON.parse(data);
		const id = Number(req.params.id);

		if (dataJSON.map((gatito) => gatito.id).includes(id)) {
			fs.writeFile(
				`${__dirname}/assets/cats.json`,
				JSON.stringify(dataJSON),
				(err) => {
					const i = dataJSON.map((gatito) => gatito.id).indexOf(id);
					dataJSON.splice(i, 1);

					res.json({
						status: "success",
						data: dataJSON,
					});
				}
			)
		} else {
			res.status(404).json({
				status: 'fail',
				message: 'Gato no encontrado'
			});
		}
	});
});

const port = 8080;

app.listen(port, () => {
    console.log(`App corriendo en puerto ${port}`)
})

// si no aclaro el status envia 200

/* app.post('/', (req, res) => {
    res.status(404).send('Me hiciste un post!')
})  */

/* app.get('/', (req, res) => {
    res.json({
        Estado: 'Tu pedido fue exitoso'
    })
})  */