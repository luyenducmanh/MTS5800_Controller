export const GENERAL_CMD = {
  ///
  SYSTEM_ERROR: "SYST:ERR?", // Kiểm tra hệ thống xem có lỗi hay không ( cần thực hiện sau mỗi lệnh được gửi đi )
  REM: "*REM", // Bắt đầu chế độ điều khiển từ xa cho máy hoặc module
  IDN: "*IDN?",
  OPC: "*OPC?",
  //* Lấy danh sách các module mà máy hỗ trợ
  GET_LIST_MODULE: "MOD:FUNC:LIST?",
};

export const MODULE_CMD = {
  GET_POWER_STATUS: "MOD:FUNC:SEL?", // Kiẻm tra xem module đã được bật hay chưa
  GET_PORT: "MOD:FUNC:PORT?", // Lấy port của module
  IS_READY: ":SYST:FUNC:READY?", // Kiểm tra trạng thái sẵn sàng của module
};

export const APPLICATION_CMD = {
  GET_LIST: ":SYSTem:APPLication:APPLications?", // Truy vấn danh sách ứng dụng khả dụng
  RUN: ":SYSTem:APPLication:LAUNch", // Khởi chạy một ứng dụng
  GET_ID: ":SYSTem:APPLication:LAUNch?", // Truy vấn ID của ứng dụng đang chạy
  SELECT: ":SYSTem:APPLication:SELect", // Chọn ứng dụng để làm việc
  EXIT: ":EXIT", // Thoát ứng dụng đang chạy
};

export const SESSION_CMD = {
  CREATE: ":SESSion:CREate", // Tạo phiên làm việc
  START: ":SESSion:STARt", // Bắt đầu phiên làm việc vừa tạo
  END: ":SESSion:END", //Kết thúc session
};

export const MEASURE_CMD = {
  INIT: ":INITiate", // Bắt đầu phép đo
  ABORT: ":ABORt", // Dừng phép đo
};
