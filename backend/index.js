import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import morgan from "morgan";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://travel-buddy-rkr.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const uri = process.env.DB_URI;

const verifyJWT = (req, res, next) => {
  const token = req?.cookies?.["JWT"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token verification failed" });
  }
};

function verifyRole(allowedRoles = []) {
  return function (req, res, next) {
    const user = req.user;
    if (!allowedRoles.includes(user?.role)) {
      return res.status(403).json({ error: "Access denied." });
    }
    next();
  };
}
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("travel-buddy");
    const users = database.collection("users");
    const stories = database.collection("stories");
    const applications = database.collection("applications");
    const packages = database.collection("packages");
    const bookings = database.collection("bookings");
    const payments = database.collection("payments");

    app.post("/login", (req, res) => {
      const user = req.body;
      if (!user) {
        return res.status(400).json({ error: "Missing login payload" });
      }

      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res
        .cookie("JWT", `Bearer ${token}`, {
          httpOnly: true,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 1000,
        })
        .status(200)
        .json({ message: "Login successful", token });
    });

    app.post("/logout", (req, res) => {
      res
        .clearCookie("JWT", {
          httpOnly: true,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ message: "Logout successful. Token cleared from cookie." });
    });

    app.post("/register", async (req, res) => {
      const user = req.body;

      try {
        // Check if user already exists
        const existingUser = await users.findOne({ email: user.email });
        if (existingUser) {
          return res.status(200);
        }

        // Create user
        const newUser = {
          ...user,
          role: "tourist",
          createdAt: new Date(),
        };

        const result = await users.insertOne(newUser);

        res.status(201).json({
          message: "User registered successfully",
          user: {
            ...user,
            id: result.insertedId,
            role: "tourist",
            createdAt: new Date(),
          },
        });
      } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ error });
      }
    });

    app.get("/user/:email", async (req, res) => {
      try {
        const user = await users.findOne({ email: req.params.email });

        if (!user) return res.status(404).json({ error: "User not found" });

        const { password, ...safeUser } = user; // omit password
        res.status(200).json({ user: safeUser });
      } catch (error) {
        console.error("User Info Error:", error.message);
        res.status(500).json({ error: "Failed to fetch user info" });
      }
    });

    app.patch("/user/:id", verifyJWT, async (req, res) => {
      const { id } = req.params;
      const { name, image } = req.body;

      try {
        const result = await users.updateOne(
          { _id: new ObjectId(id) },
          { $set: { name, image, updatedAt: new Date() } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "User not found or unchanged" });
        }

        const updatedUser = await users.findOne({ _id: new ObjectId(id) });

        res.status(200).json({
          message: "Profile updated successfully",
          user: updatedUser,
        });
      } catch (error) {
        console.error("Update Error:", error.message);
        res.status(500).json({ error: "Failed to update profile" });
      }
    });

    app.get("/guides", async (req, res) => {
      try {
        const result = await users
          .find(
            { role: "guide" },
            { projection: { name: 1, email: 1, image: 1 } }
          )
          .toArray();

        res.status(200).json(result);
      } catch (err) {
        console.error("Guide List Error:", err.message);
        res.status(500).json({ error: "Failed to fetch guides" });
      }
    });

    app.post(
      "/stories",
      verifyJWT,
      verifyRole(["tourist", "guide"]),
      async (req, res) => {
        const { title, description, images, author } = req.body;

        if (
          !title ||
          !description ||
          !images ||
          !Array.isArray(images) ||
          images.length === 0
        ) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        try {
          const story = {
            title,
            description,
            images, // array of image URLs
            author: {
              name: author?.name,
              email: author?.email,
              image: author?.image,
              role: author?.role || "tourist",
            },
            createdAt: new Date(),
          };

          const result = await stories.insertOne(story);

          res.status(201).json({
            message: "Story added successfully",
            storyId: result.insertedId,
          });
        } catch (error) {
          console.error("Add Story Error:", error.message);
          res.status(500).json({ error: "Failed to add story" });
        }
      }
    );

    app.get("/stories/random", async (req, res) => {
      const limit = parseInt(req.query.limit) || 4;

      try {
        const result = await stories
          .aggregate([{ $sample: { size: limit } }])
          .toArray();

        res.status(200).json(result);
      } catch (err) {
        console.error("Random Stories Error:", err.message);
        res.status(500).json({ error: "Failed to fetch stories" });
      }
    });

    // routes/stories.js
    app.get("/stories", async (req, res) => {
      const { sort = "createdAt", order = "desc", role } = req.query;

      try {
        const filter = role ? { "author.role": role } : {};
        const sortOrder = order === "asc" ? 1 : -1;

        const result = await stories
          .find(filter)
          .sort({ [sort]: sortOrder })
          .toArray();

        res.status(200).json(result);
      } catch (err) {
        console.error("Fetch Stories Error:", err.message);
        res.status(500).json({ error: "Failed to fetch stories" });
      }
    });

    app.get(
      "/stories/my",
      verifyJWT,
      verifyRole(["tourist", "guide"]),
      async (req, res) => {
        const email = req.user.email;
        const result = await stories.find({ "author.email": email }).toArray();
        res.status(200).json(result);
      }
    );

    app.delete(
      "/stories/:id",
      verifyJWT,
      verifyRole(["tourist", "guide"]),
      async (req, res) => {
        const { id } = req.params;
        const email = req.user.email;

        const story = await stories.findOne({ _id: new ObjectId(id) });

        if (!story || story.author.email !== email) {
          return res.status(403).json({ error: "Unauthorized delete attempt" });
        }

        await stories.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ message: "Story deleted" });
      }
    );

    app.get(
      "/stories/:id",
      verifyJWT,
      verifyRole(["tourist", "guide"]),
      async (req, res) => {
        const story = await stories.findOne({
          _id: new ObjectId(req.params.id),
        });
        res.status(200).json(story);
      }
    );

    app.put(
      "/stories/:id",
      verifyJWT,
      verifyRole(["tourist", "guide"]),
      async (req, res) => {
        const { title, description, newImages } = req.body;
        const updateDoc = {
          $set: { title, description },
          ...(newImages?.length && { $push: { images: { $each: newImages } } }),
        };
        const result = await stories.updateOne(
          { _id: new ObjectId(req.params.id), "author.email": req.user.email },
          updateDoc
        );
        res.status(200).json({ message: "Story updated" });
      }
    );

    app.patch(
      "/stories/:id/remove-image",
      verifyJWT,
      verifyRole(["tourist", "guide"]),
      async (req, res) => {
        const { url } = req.body;
        const result = await stories.updateOne(
          { _id: new ObjectId(req.params.id), "author.email": req.user.email },
          { $pull: { images: url } }
        );
        res.status(200).json({ message: "Image removed" });
      }
    );

    app.post(
      "/applications/tour-guide",
      verifyJWT,
      verifyRole(["tourist", "guide"]),
      async (req, res) => {
        const { title, motivation, cvLink } = req.body;

        if (!title || !motivation || !cvLink) {
          return res.status(400).json({ error: "All fields are required" });
        }

        try {
          const application = {
            title,
            motivation,
            cvLink,
            submittedBy: {
              name: req.user?.name,
              email: req.user?.email,
              image: req.user?.image,
              role: req.user?.role || "tourist",
            },
            status: "pending",
            submittedAt: new Date(),
          };

          const result = await applications.insertOne(application);

          res.status(201).json({
            message: "Application submitted successfully",
            applicationId: result.insertedId,
          });
        } catch (err) {
          console.error("Join Guide Error:", err.message);
          res.status(500).json({ error: "Failed to submit application" });
        }
      }
    );

    app.post("/bookings", verifyJWT, async (req, res) => {
      const {
        packageId,
        packageName,
        price,
        tourDate,
        guideName,
        guideEmail,
        guideImage,
        touristName,
        touristEmail,
        touristImage,
        status,
        bookedAt,
      } = req.body;

      // Validate required fields
      if (!packageId || !guideEmail || !tourDate || !touristEmail) {
        console.log(packageId, guideEmail, touristEmail, tourDate);
        return res.status(400).json({ error: "Missing required fields" });
      }

      const booking = {
        packageId,
        packageName,
        price,
        guideName,
        guideEmail,
        guideImage,
        tourDate: new Date(tourDate),
        touristName,
        touristEmail,
        touristImage,
        status: status || "pending",
        bookedAt: bookedAt || new Date(),
      };

      try {
        const result = await bookings.insertOne(booking);
        res.status(201).json({
          message: "Booking created",
          bookingId: result.insertedId,
        });
      } catch (err) {
        console.error("Booking Error:", err.message);
        res.status(500).json({ error: "Booking failed" });
      }
    });

    app.get(
      "/bookings/my",
      verifyJWT,
      verifyRole(["tourist", "guide"]),
      async (req, res) => {
        const { email } = req.user;
        const result = await bookings.find({ guideEmail: email }).toArray();
        res.status(200).json(result);
      }
    );

    app.delete(
      "/bookings/:id",
      verifyJWT,
      verifyRole(["tourist", "guide"]),
      async (req, res) => {
        const result = await bookings.deleteOne({
          _id: new ObjectId(req.params.id),
          touristEmail: req.user.email,
        });

        if (result.deletedCount === 0)
          return res
            .status(404)
            .json({ error: "Booking not found or unauthorized" });

        res.status(200).json({ message: "Booking cancelled" });
      }
    );

    app.post(
      "/packages",
      verifyJWT,
      verifyRole(["admin"]),
      async (req, res) => {
        const { title, tourType, price, itinerary, images } = req.body;

        if (!title || !tourType || !price || !itinerary || !images?.length) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const packageData = {
          title,
          tourType,
          price: parseFloat(price),
          itinerary,
          images,
          createdAt: new Date(),
        };

        try {
          const result = await packages.insertOne(packageData);
          res
            .status(201)
            .json({ message: "Package created", id: result.insertedId });
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Failed to create package" });
        }
      }
    );

    app.get("/packages", async (req, res) => {
      try {
        const result = await packages.find().toArray();
        res.status(200).json(result);
      } catch (err) {
        console.error("Fetch Packages Error:", err.message);
        res.status(500).json({ error: "Unable to fetch tour packages" });
      }
    });

    app.get("/packages/:id", async (req, res) => {
      try {
        const result = await packages.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!result) {
          return res.status(404).json({ error: "Package not found" });
        }

        res.status(200).json(result);
      } catch (err) {
        console.error("Package Details Error:", err.message);
        res.status(500).json({ error: "Unable to fetch package details" });
      }
    });

    app.post("/create-payment", verifyJWT, async (req, res) => {
      const { bookingId, packageName, price, touristEmail } = req.body;

      if (!bookingId || !price || !touristEmail) {
        return res.status(400).json({ error: "Missing payment data" });
      }

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "bdt",
                product_data: {
                  name: packageName,
                },
                unit_amount: price * 100,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.FRONTEND_URL}/dashboard/payment-success?bookingId=${bookingId}`,
          cancel_url: `${process.env.FRONTEND_URL}/dashboard/bookings`,
          customer_email: touristEmail,
        });

        res.status(200).json({ url: session.url });
      } catch (err) {
        console.error("Stripe Error:", err.message);
        res.status(500).json({ error: "Stripe payment failed" });
      }
    });

    app.post("/payments", verifyJWT, async (req, res) => {
      const { bookingId, transactionId, amount } = req.body;

      if (!bookingId || !transactionId || !amount) {
        return res.status(400).json({ error: "Missing payment info" });
      }

      try {
        // Save transaction
        await payments.insertOne({
          bookingId,
          transactionId,
          amount,
          paidAt: new Date(),
          userEmail: req.user.email,
        });

        // Update booking status
        await bookings.updateOne(
          { _id: new ObjectId(bookingId) },
          { $set: { status: "in-review" } }
        );

        res.status(200).json({ message: "Payment recorded" });
      } catch (err) {
        console.error("Payment Recording Error:", err.message);
        res.status(500).json({ error: "Failed to record payment" });
      }
    });

    app.get("/payments/history", verifyJWT, async (req, res) => {
      const email = req.query.email;

      if (!email) {
        return res.status(400).json({ error: "Missing user email" });
      }

      try {
        const result = await payments
          .find({ userEmail: email })
          .sort({ paidAt: -1 })
          .toArray();

        res.status(200).json(result);
      } catch (err) {
        console.error("Payment History Error:", err.message);
        res.status(500).json({ error: "Failed to fetch payment history" });
      }
    });

    app.get("/bookings/:id", verifyJWT, async (req, res) => {
      try {
        const result = await bookings.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!result) {
          return res.status(404).json({ error: "Booking not found" });
        }

        res.status(200).json(result);
      } catch (err) {
        console.error("Booking fetch error:", err.message);
        res.status(500).json({ error: "Unable to retrieve booking" });
      }
    });

    app.get(
      "/bookings/my/guide",
      verifyJWT,
      verifyRole(["guide"]),
      async (req, res) => {
        const { email } = req.query;
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        try {
          const result = await bookings.find({ guideEmail: email }).toArray();
          console.log("result", result);
          console.log("Sending bookings list:", result.length);

          // 🔧 Prevent browser caching
          res.status(200).json(result);
        } catch (err) {
          console.error("Assigned Tours Error:", err.message);
          res.status(500).json({ error: "Failed to fetch assigned tours" });
        }
      }
    );

    app.get(
      "/bookings/my/tourist",
      verifyJWT,
      verifyRole(["tourist"]),
      async (req, res) => {
        const { email } = req.query;
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        try {
          const result = await bookings.find({ touristEmail: email }).toArray();
          console.log("result", result);
          console.log("Sending bookings list:", result.length);

          // 🔧 Prevent browser caching
          res.status(200).json(result);
        } catch (err) {
          console.error("Assigned Tours Error:", err.message);
          res.status(500).json({ error: "Failed to fetch assigned tours" });
        }
      }
    );

    // PATCH /bookings/:id/status
    app.patch(
      "/bookings/:id/status",
      verifyJWT,
      verifyRole(["guide"]),
      async (req, res) => {
        const { status } = req.body;
        const bookingId = req.params.id;

        try {
          await bookings.updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { status } }
          );
          res.status(200).json({ message: "Status updated" });
        } catch (err) {
          console.error("Status update error:", err.message);
          res.status(500).json({ error: "Failed to update booking status" });
        }
      }
    );

    app.get("/users", verifyJWT, verifyRole(["admin"]), async (req, res) => {
      try {
        const usersCollection = await users.find().toArray();
        res.status(200).json(usersCollection);
      } catch (err) {
        console.error("Fetch users error:", err.message);
        res.status(500).json({ error: "Failed to fetch users" });
      }
    });

    app.patch(
      "/users/:id/role",
      verifyJWT,
      verifyRole(["admin"]),
      async (req, res) => {
        const { role } = req.body;
        const id = req.params.id;

        try {
          await users.updateOne({ _id: new ObjectId(id) }, { $set: { role } });
          res.status(200).json({ message: "Role updated" });
        } catch (err) {
          console.error("Update role error:", err.message);
          res.status(500).json({ error: "Failed to update role" });
        }
      }
    );
    app.post(
      "/candidates",
      verifyJWT,
      verifyRole(["tourist"]),
      async (req, res) => {
        const data = req.body;
        if (
          !data.applicantEmail ||
          !data.title ||
          !data.cvLink ||
          !data.reason
        ) {
          return res.status(400).json({ error: "Missing required fields" });
        }
        try {
          await applications.insertOne({
            ...data,
            appliedAt: new Date(),
            status: "pending",
          });
          res.status(201).json({ message: "Submitted successfully" });
        } catch (err) {
          res.status(500).json({ error: "Server error" });
        }
      }
    );

    app.get(
      "/candidates",
      verifyJWT,
      verifyRole(["admin"]),
      async (req, res) => {
        try {
          const result = await applications.find().toArray();
          res.status(200).json(result);
        } catch (err) {
          res.status(500).json({ error: "Fetch failed" });
        }
      }
    );

    app.post(
      "/candidates/:id/approve",
      verifyJWT,
      verifyRole(["admin"]),
      async (req, res) => {
        const id = req.params.id;
        try {
          const candidate = await applications.findOne({
            _id: new ObjectId(id),
          });
          if (!candidate)
            return res.status(404).json({ error: "Candidate not found" });

          await users.updateOne(
            { email: candidate.applicantEmail },
            { $set: { role: "guide" } }
          );
          await applications.deleteOne({ _id: new ObjectId(id) });
          res.status(200).json({ message: "Promoted and deleted" });
        } catch (err) {
          res.status(500).json({ error: "Approval error" });
        }
      }
    );

    app.delete(
      "/candidates/:id",
      verifyJWT,
      verifyRole(["admin"]),
      async (req, res) => {
        const candidateId = req.params.id;

        try {
          const result = await applications.deleteOne({
            _id: new ObjectId(candidateId),
          });

          if (result.deletedCount === 0) {
            return res
              .status(404)
              .json({ error: "Candidate not found or already removed" });
          }

          res.status(200).json({ message: "Candidate application deleted" });
        } catch (err) {
          console.error("Candidate deletion error:", err.message);
          res.status(500).json({ error: "Failed to delete candidate" });
        }
      }
    );

    app.get("/package/random", async (req, res) => {
      try {
        const result = await packages.find().toArray();

        res.status(200).json(result);
      } catch (err) {
        console.error("Error fetching packages:", err.message);
        res.status(500).json({ error: "Failed to retrieve packages" });
      }
    });

    app.get("/guides/random", async (req, res) => {
      try {
        const result = await users
          .aggregate([{ $match: { role: "guide" } }, { $sample: { size: 6 } }])
          .toArray();
        res.status(200).json(result);
      } catch (err) {
        console.error("Random guides error:", err.message);
        res.status(500).json({ error: "Failed to fetch guides" });
      }
    });

    app.get("/guide/:id", async (req, res) => {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid guide ID" });
      }

      try {
        const guide = await users.findOne({
          _id: new ObjectId(id),
          role: "guide",
        });

        if (!guide) return res.status(404).json({ error: "Guide not found" });

        res.status(200).json({
          name: guide.name,
          email: guide.email,
          image: guide.image,
          bio: guide.bio || "",
        });
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch guide" });
      }
    });

    app.get("/stories", async (req, res) => {
      const { guideEmail } = req.query;
      console.log("big bang");
      console.log(guideEmail);
      // if (!ObjectId.isValid(guideId)) {
      //   return res.status(400).json({ error: "Invalid guide ID" });
      // }

      try {
        const result = await stories
          .find({
            "author.email": guideEmail,
          })
          .toArray();
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch stories" });
      }
    });

    app.get("/story/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid story ID" });
      }

      try {
        const story = await stories.findOne({ _id: new ObjectId(id) });

        if (!story) {
          return res.status(404).json({ error: "Story not found" });
        }

        res.status(200).json(story);
      } catch (err) {
        console.error("Story details error:", err.message);
        res.status(500).json({ error: "Failed to fetch story" });
      }
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Grade Mate app listening on port ${port}`);
});
