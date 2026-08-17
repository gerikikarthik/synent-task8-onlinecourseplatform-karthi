const adminOnly = (req, res, next) => {

  try {


    if (!req.user) {

      return res.status(401).json({

        message: "User not authenticated"

      });

    }



    if (req.user.role !== "admin") {

      return res.status(403).json({

        message: "Admin access only"

      });

    }



    next();


  } catch (error) {


    return res.status(500).json({

      message: "Admin middleware error"

    });


  }

};


module.exports = adminOnly;