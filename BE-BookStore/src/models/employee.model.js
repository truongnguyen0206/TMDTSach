// const mongoose = require("mongoose")

// const employeeSchema = new mongoose.Schema(
//   {
//     employeeId: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     firstName: {
//       type: String,
//       required: [true, "Vui lòng nhập tên"],
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       required: [true, "Vui lòng nhập họ"],
//       trim: true,
//     },
//     gender: {
//       type: String,
//       enum: ["male", "female", "other"],
//       required: true,
//     },
//     dateOfBirth: {
//       type: Date,
//       required: true,
//     },
//     phone: {
//       type: String,
//       required: [true, "Vui lòng nhập số điện thoại"],
//       trim: true,
//     },
//     address: {
//       street: String,
//       city: String,
//       state: String,
//       zipCode: String,
//       country: String,
//     },
//     department: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Department",
//     },
//     joinDate: {
//       type: Date,
//       required: true,
//       default: Date.now,
//     },
//     employmentStatus: {
//       type: String,
//       enum: ["active", "on_leave", "nghi_viec"],
//       default: "active",
//     },
//     terminationDate: {
//       type: Date,
//     },
   
//     emergencyContact: {
//       name: String,
//       relationship: String,
//       phone: String,
//     },
//     documents: [
//       {
//         name: String,
//         type: String,
//         url: String,
//         uploadDate: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   },
// )

// // Tạo tên đầy đủ ảo
// employeeSchema.virtual("fullName").get(function () {
//   return `${this.firstName} ${this.lastName}`
// })

// // Đảm bảo virtuals được bao gồm khi chuyển đổi sang JSON
// employeeSchema.set("toJSON", { virtuals: true })
// employeeSchema.set("toObject", { virtuals: true })

// module.exports = mongoose.model("Employee", employeeSchema)
const mongoose = require("mongoose")

const EmployeeSchema = new mongoose.Schema(
  {
    // 🔹 Liên kết đến bảng User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      trim: true,
    },
    // 🔹 Mã nhân viên
    employeeId: {
      type: String,
      // unique: true,
      required: true,
    },

    // 🔹 Họ và tên
    firstName: {
      type: String,
      required: [true, "Vui lòng nhập họ nhân viên"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Vui lòng nhập tên nhân viên"],
      trim: true,
    },

    // 🔹 Vai trò (admin, employee, manager,...)
    role: {
      type: String,
      enum: ["admin", "employee", "manager", "staff"],
      default: "employee",
    },

    // 🔹 Giới tính
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    // 🔹 Ngày sinh
    dateOfBirth: {
      type: Date,
    },

    // 🔹 Số điện thoại
    phone: {
      type: String,
      trim: true,
    },

   

    // 🔹 Ngày bắt đầu làm việc
    joinDate: {
      type: Date,
      default: Date.now,
    },

    // 🔹 Avatar
    avatar: {
      type: String,
      default: "/images/default-avatar.png",
    },

    // 🔹 Trạng thái làm việc
    employmentStatus: {
      type: String,
      enum: ["active", "inactive", "nghi_viec"],
      default: "active",
    },

 
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Employee", EmployeeSchema)