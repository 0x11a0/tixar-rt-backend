const blockedIPs = ['128.106.241.163']; 

exports.blockIPs = (req, res, next) => {
    const clientIP = req.ip; // or req.connection.remoteAddress for older Express versions
    console.log(clientIP);
    if (blockedIPs.includes(clientIP)) {
        res.status(403).send('Your IP address is blocked.');
        return;
    }
    next();
}
