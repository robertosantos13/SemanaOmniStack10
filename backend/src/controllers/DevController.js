const Dev = require('../models/Dev');
const axios = require('axios');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        const dev = await Dev.find();
        return response.json(dev);
    },
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = apiResponse.data;

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })
        }

        return response.json(dev);

    },

    async update(request, response) {
        const { id } = request.query;

        const { techs, name, latitude, longitude } = request.body;

        const techsArray = parseStringAsArray(techs);

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }

        const dev = await Dev.updateOne({ _id: id }, {
            name,
            techs: techsArray,
            location
        })


        if (dev.n == 1) {
            return response.json({ 'Update': true });
        }

        return response.json({ dev: dev });

    },

    async destroy(request, response) {
        const { id } = request.query;

        const dev = await Dev.deleteOne({ _id: id });

        if (dev.n == 1) {
            return response.json({ 'Delete': true });
        }

        return response.json({ dev: [] });
    }
}