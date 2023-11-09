package com.example.banking_money.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.lang.Override;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CustomError implements ErrorController {


    @GetMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        if (status != null) {
            int statusCode = Integer.parseInt(status.toString());
            if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                model.addAttribute("errorTitle", "Error 500: Sever Error");
                model.addAttribute("errorMessage", "Xin lỗi, đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.");
                model.addAttribute("isError500", true); // đặt biến cờ cho lỗi 500
            } else if (statusCode == HttpStatus.NOT_FOUND.value()) {
                model.addAttribute("errorTitle", "Error 404: Page Not Found");
                model.addAttribute("errorMessage", "Xin lỗi, trang bạn đang tìm kiếm không tìm thấy!");
                model.addAttribute("isError404", true);
            }
        }
        return "error";
    }

}
