const blockedIPs = []; 

exports.blockIPs = (req, res, next) => {
    const clientIP = req.ip; // or req.connection.remoteAddress for older Express versions

    if (blockedIPs.includes(clientIP)) {
        res.status(403).send('Your IP address is blocked.');
        return;
    }
    next();
}
