
let bankingSelected = {};
const url = 'http://localhost:8080/api/customer';
let page = 0;
let size = 10;
let totalPage = 0;

const validateName = (event) => {
    const input = event.target;
    const errorContainer = input.nextElementSibling; // lấy phần tử kế tiếp (container lỗi)
    const value = input.value;
    // thực hiện kiểm tra giá trị ở đây
    if (value.trim() === '') {
        errorContainer.textContent = 'This field is required!';
    }
}
const validatePhone = (event) => {
    const input = event.target;
    const errorContainer = input.nextElementSibling;
    const value = input.value;

    if (value.trim() === '') {
        errorContainer.textContent = 'This field is required!';
    }
}

const validateEmail = (event) => {
    const input = event.target;
    const errorContainer = input.nextElementSibling;
    const value = input.value;

    if (value.trim() === '') {
        errorContainer.textContent = 'This field is required!';
    }
}

const clearError = (event) => {
    const input = event.target;
    const errorContainer = input.nextElementSibling;
    errorContainer.textContent = ''; // xóa thông báo lỗi khi thay đổi giá trị
}

const renderCustomer = (item) => {
    return `
                <tr id="tr_${item.id}">
                    <td>${item.id}</td>
                    <td>${item.fullName}</td>
                    <td>${item.email}</td>
                    <td>${item.phone}</td>
                    <td>${item.locationRegion.provinceName}</td>
                    <td>${item.locationRegion.districtName}</td>
                    <td>${item.locationRegion.wardName}</td>
                    <td>${item.locationRegion.address}</td>
                    <td id="balance-${item.id}">${item.balance}</td>
                    <td>
                        <button class="btn btn-outline-primary edit" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modalUpdate">
                            <i class="fas fa-user-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-outline-success" onclick="showPlus(${item.id})" data-bs-toggle="modal" data-bs-target="#modalPlus">
                            <i class="fas fa-plus"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-outline-warning" onclick="showMinus(${item.id})" data-bs-toggle="modal" data-bs-target="#modalMinus">
                            <i class="fas fa-minus"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-outline-secondary" onclick="showFormTransfer(${item.id})" data-bs-toggle="modal" data-bs-target="#modalTransfer">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-outline-danger" onclick="deleteById(${item.id})">
                            <i class="fas fa-user-slash"></i>
                        </button>
                    </td>
                </tr>
            `;
}

const strBody = $('#tbCustomerBody');
const getAllCustomers = () => {
    // dùng ajax để call api, dùng Jquery để action HTTP đến 1 url cụ thể
    $.ajax({
        type: 'get',
        url: `http://localhost:8080/api/customer?page=${page || 0}&size=${size || 0}`,
        success: function (res) {
            strBody.empty(); // clear hết element có id là strBody, clear dữ liệu cũ trước khi hiển thị dữ liệu mới
            totalPage = res.totalPages;

            // lặp qua mảng content trong obj res
            $.each(res.content, (index, item) => {
                const str = renderCustomer(item); //gọi hàm tạo chuỗi HTML dựa trên dữ liệu khách hàng đc truyền vào

                $(strBody).prepend(str); //thêm chuỗi HTML str vào đầu pt id strBody, hiển thị khách hàng

            })

            renderPagination();

            // gán 1 sự kiện click cho tất cả các pt có class CSS là edit.
            $('.edit').on('click', function () {
                const id = $(this).data('id');

                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    method: "GET",
                    url: url + '/' + id,
                })
                    .done((data) => {
                        if (Object.keys(data).length > 0) {
                            let customer = data;
                            let locationRegion = customer.locationRegion;
                            getAllDistrictsByProvinceId(locationRegion.provinceId, $("#districtUp"), data).then((data) => {
                                $('#districtUp').val(locationRegion.districtId);

                                getAllWardsByDistrictId(locationRegion.districtId, $("#wardUp")).then((data) => {
                                    $('#wardUp').val(locationRegion.wardId);
                                })
                            })


                            $('#idUp').val(customer.id);
                            $('#fullNameUp').val(customer.fullName);
                            $('#emailUp').val(customer.email);
                            $('#phoneUp').val(customer.phone);
                            $('#provinceUp').val(locationRegion.provinceId);
                            $('#addressUp').val(locationRegion.address);

                            $('#modalUpdate').show();
                        }
                        else {
                            alert('Say No');
                        }
                    })
                    .fail((error) => {
                        console.log(error);
                    })

            })

        }, error: function () {
            alert('Error');
        }
    });

}

getAllCustomers();

const renderOptionProvince = (obj) => {
    return `<option value="${obj.province_id}">${obj.province_name}</option>`;
}

const renderOptionDistrict = (obj) => {
    return `<option value="${obj.district_id}">${obj.district_name}</option>`;
}

const renderOptionWard = (obj) => {
    return `<option value="${obj.ward_id}">${obj.ward_name}</option>`;
}

const getAllDistrictsByProvinceId = (provinceId, elem, callback) => {
    return $.ajax({
        url: 'https://vapi.vnappmob.com/api/province/district/' + provinceId
    }).done(data => {
        const districts = data.results;
        elem.empty();
        $.each(districts, (index, item) => {
            const str = renderOptionDistrict(item);
            elem.append(str);
        });
        if (callback) {
            callback(districts);
        }
    }).fail((error) => {
        console.log(error);
    });
}

const getAllWardsByDistrictId = (districtId, elem) => {
    return $.ajax({
        url: 'https://vapi.vnappmob.com/api/province/ward/' + districtId
    }).done((data) => {
        const wards = data.results;

        elem.empty();

        $.each(wards, (index, item) => {
            const str = renderOptionWard(item);
            elem.append(str);
        });
    }).fail((error) => {
        console.log(error);
    });
}

const getAllProvinces = () => {
    return $.ajax({
        url: 'https://vapi.vnappmob.com/api/province/'
    }).done(data => {
        const provinces = data.results;
        $("#provinceCre").empty().append('<option value="">Vui lòng chọn tỉnh thành</option>');
        $.each(provinces, (index, item) => {
            const str = renderOptionProvince(item);
            $("#provinceCre").append(str);
            $("#provinceUp").append(str);
        });
    }).fail((error) => {
        console.log(error);
    });
}

$("#provinceCre").on("change", function() {
    const provinceId = $(this).val();
    getAllDistrictsByProvinceId(provinceId, $("#districtCre"), function(data) {
        const districtId = $("#districtCre").val()
        getAllWardsByDistrictId(districtId, $("#wardCre"));
    });
});

$("#districtCre").on("change", function() {
    const districtId = $(this).val();
    getAllWardsByDistrictId(districtId, $("#wardCre"));
});

$("#provinceUp").on("change", function() {
    const provinceId = $(this).val();
    getAllDistrictsByProvinceId(provinceId, $("#districtUp"), function(data) {
        const districtId = $("#districtUp").val()
        getAllWardsByDistrictId(districtId, $("#wardUp"));
    });
});


$("#districtUp").on('change', function () {
    const districtId = $(this).val();
    getAllWardsByDistrictId(districtId, $("#wardUp"));
})

getAllProvinces();

const btnCreate = $('#btnCreate');
btnCreate.on('click', () => {
    btnCreate.attr('disabled', true);
    let load = webToast.loading({
        status: 'Loading...',
        message: 'Please Wait a moment',
        align: 'bottomright',
        delay: 1000,
        line: true,
    });

    const inputFields = getDataInput();
    let hasError = false;
    // kiểm tra và hiển thị thông báo lỗi cho mỗi trường
    inputFields.forEach((field) => {
        const inputElement = $(`#${field.name}Cre`);
        const value = inputElement.val();
        const errorContainer = $(`#${field.name}ErrorContainer`); // thêm container cho thông báo lỗi

        if (field.required && !value) {
            hasError = true;
            errorContainer.text(`Please enter a valid ${field.label}`); // hiển thị thông báo lỗi
        } else if (field.pattern && !new RegExp(field.pattern).test(value)) {
            hasError = true;
            errorContainer.text(field.message); // hiển thị thông báo lỗi
        } else {
            errorContainer.text(''); // xóa thông báo lỗi nếu hợp lệ
        }
    });

    if (hasError) {
        // nếu có lỗi, không thực hiện yêu cầu AJAX và kết thúc
        btnCreate.attr('disabled', false);
        load.remove();
        return;
    }

    const obj = {
        fullName: $('#fullNameCre').val(),
        email: $('#emailCre').val(),
        phone: $('#phoneCre').val(),
        locationRegion: {
            provinceId: $("#provinceCre").val(),
            provinceName: $("#provinceCre").find("option:selected").text(),
            districtId: $("#districtCre").val(),
            districtName: $("#districtCre").find("option:selected").text(),
            wardId: $("#wardCre").val(),
            wardName: $("#wardCre").find("option:selected").text(),
            address: $('#addressCre').val()
        },
        balance: 0,
        deleted: 0
    }

    setTimeout(() => {
        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'POST',
            url: 'http://localhost:8080/api/customer',
            dataType: 'json',
            data: JSON.stringify(obj),
        })
            .done((data) => {
                console.log("Success");
                const str = renderCustomer(data);
                getAllCustomers();
                $(strBody).prepend(str);


                $('#modalCreate').hide();
                $('#closeCre').click();

                webToast.Success({
                    status: 'Thêm mới thành công',
                    message: '',
                    delay: 2000,
                    align: 'topright'
                });
                $('#formCre').trigger("reset");

            })
            .fail((error) => {
                console.log(error);
            })
            .always(() => {
                btnCreate.attr('disabled', false);
                load.remove();
            })
    }, 5000);
})


const btnUpdate = $('#btnUpdate');
btnUpdate.on('click', () => {
    btnUpdate.attr('disabled', true);
    const customerId = $('#idUp').val();


    let load = webToast.loading({
        status: 'Loading...',
        message: 'Please Wait a moment',
        align: 'bottomright',
        delay: 1000,
        line: true,
    });

    const inputFields = getDataInput();
    let hasError = false;
    inputFields.forEach((field) => {
        const inputElement = $(`#${field.name}Up`);
        const value = inputElement.val();
        const error = $(`#${field.name}Error`); // thêm container cho thông báo lỗi

        if (field.required && !value) {
            hasError = true;
            error.text(`Please enter a valid ${field.label}`); // hiển thị thông báo lỗi
        } else if (field.pattern && !new RegExp(field.pattern).test(value)) {
            hasError = true;
            error.text(field.message); // hiển thị thông báo lỗi
        } else {
            error.text(''); // xóa thông báo lỗi nếu hợp lệ
        }
    });

    if (hasError) {
        // nếu có lỗi, không thực hiện yêu cầu AJAX và kết thúc
        btnUpdate.attr('disabled', false);
        load.remove();
        return;
    }

    const obj = {
        fullName: $('#fullNameUp').val(),
        email: $('#emailUp').val(),
        phone: $('#phoneUp').val(),
        locationRegion: {
            provinceId: $("#provinceUp").val(),
            provinceName: $("#provinceUp").find("option:selected").text(),
            districtId: $("#districtUp").val(),
            districtName: $("#districtUp").find("option:selected").text(),
            wardId: $("#wardUp").val(),
            wardName: $("#wardUp").find("option:selected").text(),
            address: $('#addressUp').val()
        },

    }

    setTimeout(() => {
        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'PATCH',
            url: 'http://localhost:8080/api/customer/' + customerId,
            data: JSON.stringify(obj),
        })
            .done((data) => {
                const str = renderCustomer(data);
                const currentRow = $('#tr_' + customerId);
                currentRow.replaceWith(str);

                $('#modalUpdate').hide();
                $('#closeUp').click();


                webToast.Success({
                    status: 'Cập nhật thành công',
                    message: '',
                    delay: 2000,
                    align: 'topright'
                });


            })
            .fail((error) => {
                console.log(error);
            })
            .always(() => {
                btnUpdate.attr('disabled', false);
                load.remove();
            })
    }, 5000);
})

function deleteById(customerId) {
    const balance =+$("#balance-" + customerId).text();
    if (balance > 0) {
        webToast.Danger({
            status: 'Cảnh báo',
            message: 'Không thể xóa người dùng có số dư lớn hơn 0',
            delay: 2000,
            align: 'topright'
        });
    } else {
        const confirmBox =  webToast.confirm("Are you sure to delete Customer " + customerId + "?");
        confirmBox.click(() => {
            $.ajax({
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                url: 'http://localhost:8080/api/customer/' + customerId,
                method: 'DELETE',
            }).done(e => {
                webToast.Success({
                    status: 'Xóa thành công',
                    message: '',
                    delay: 2000,
                    align: 'topright'
                });
                getAllCustomers()
            })
        })
    }
}

function showPlus(id) {
    $.ajax({
        url: url + "/" + id,
        method: "GET"
    }).done(data => {
        $("#fullNamePlus").val(data.fullName);
        $("#emailPlus").val(data.email);
        $("#balancePlus").val(data.balance)
        document.getElementById("btnPlus").onclick = function () {
            plus(data.id)
        }
    })
}
function plus(id) {
    const amount = +$("#deposit").val();
    const balance =+$("#balance-" + id).text();
    if (amount > 0) {
        let customer = {
            deposit: amount
        }
        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            url : url + "/deposit/" + id,
            method : 'POST',
            data: JSON.stringify(customer)
        }).done(data =>{
            console.log(data)
            $('#modalPlus').hide();
            $('#closePlus').click();

            webToast.Success({
                status: 'Nạp tiền thành công !!!',
                message: 'Số dư tài khoản: ' + (amount + balance),
                delay: 2000,
                align: 'topright'
            });
            getAllCustomers();
            $("#deposit").val("");

        })
    } else {
        webToast.Danger({
            status: 'Cảnh báo',
            message: 'Số tiền nhập vào phải lớn hơn 0',
            delay: 2000,
            align: 'topright'
        });
        $("#deposit").val("");
    }
}
function showMinus(id) {

    $.ajax({
        url: url + "/" + id,
        method: "GET"
    }).done(data => {
        $("#fullNameMinus").val(data.fullName);
        $("#emailMinus").val(data.email);
        $("#balanceMinus").val(data.balance);
        document.getElementById("btnMinus").onclick = function () {
            minus(data.id)
        }
    })
}
function minus(id) {

    const amount = +$("#withdraw").val();
    const balance =+$("#balance-" + id).text();
    let customer = {
        withdraw: amount,
        balance: balance
    }
    if (amount > balance) {
        webToast.Danger({
            status: 'Cảnh báo',
            message: 'Số tiền dư không đủ để rút !!',
            delay: 2000,
            align: 'topright'
        });
        $("#withdraw").val("");

    } else if (amount > 0) {
        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            url: url + "/withdraw/" + id,
            method: 'POST',
            data: JSON.stringify(customer)
        }).done(data => {
            console.log(data)
            $('#modalMinus').hide();
            $('#closeMinus').click();

            webToast.Success({
                status: 'Rút tiền thành công !!!',
                message: 'Số dư tài khoản: ' + (balance - amount),
                delay: 2000,
                align: 'topright'
            });
            getAllCustomers();
            $("#withdraw").val("");
        })
    } else {
        webToast.Danger({
            status: 'Cảnh báo',
            message: 'Số tiền rút ra phải lớn hơn 0!!',
            delay: 2000,
            align: 'topright'
        });
        $("#withdraw").val("");
    }
}
function showFormTransfer(id) {
    document.getElementById("balance").value = document.getElementById("balance-" + id).innerText;
    document.getElementById("fullNameSender").value = document.getElementById("tr_" + id).querySelectorAll("td")[1].innerText;
    document.getElementById("emailSender").value = document.getElementById("tr_" + id).querySelectorAll("td")[2].innerText;

    document.getElementById("selectTransfer").addEventListener("change", function() {
        const selectedOption = this.options[this.selectedIndex];
        document.getElementById("emailRecipient").value = selectedOption.getAttribute("data-email");
    });

    $.ajax({
        url: url + "/all",
        method: "GET"
    }).done(data => {
        const transferCustomer = data.filter(customer => customer.id !== id);
        let html = '<option>--Chọn người cần chuyển khoản--</option>';
        transferCustomer.map(customer => {
            html += `<option value="${customer.id}" data-email="${customer.email}">${customer.fullName}</option>`;
        })
        document.getElementById("selectTransfer").innerHTML = html;
        document.getElementById("btnTransfer").onclick = function () {
            const senderId = document.getElementById("tr_" + id).querySelectorAll("td")[0].innerText;
            const recipientId = document.getElementById("selectTransfer").value;
            transferAmount(senderId, recipientId)
        }
    });
}
function transferAmount(idSender, idRecipient) {

    const amount = +$("#transfer").val();
    const balance = +$("#balance-" + idSender).text();
    const name = document.getElementById("selectTransfer").selectedOptions[0].text;

    let customer = {
        transactionAmount: amount,
        balance: balance,
        senderId: idSender,
        recipientId: idRecipient
    }
    if (confirm("Bạn chắc chắn muốn chuyển " + amount + " cho " + name + "???")) {
        if (amount > balance) {
            webToast.Danger({
                status: 'Cảnh báo',
                message: 'Số tiền dư không đủ để chuyển khoản !!!',
                delay: 2000,
                align: 'topright'
            });
            $("#withdraw").val("");
        } else if (amount > 0) {
            $.ajax({
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                url: url + "/transfer",
                method: 'POST',
                data: JSON.stringify(customer)
            }).done(data => {
                console.log(data)

                $('#modalTransfer').hide();
                $('#closeTransfer').click();

                webToast.Success({
                    status: 'Chuyển tiền thành công !!!',
                    message: 'Số dư tài khoản: ' + (balance - amount),
                    delay: 2000,
                    align: 'topright'
                });
                getAllCustomers();
                $("#transfer").val("");
            })
        } else {
            webToast.Danger({
                status: 'Cảnh báo',
                message: 'Số tiền chuyển khoản phải lớn hơn 0!!',
                delay: 2000,
                align: 'topright'
            });
            $("#withdraw").val("");
        }
    } else {
        $('#modalTransfer').hide();
        $('#closeTransfer').click();
        $('#formTransfer').trigger("reset");
    }
}
const renderPagination = () => {
    const pagination = $('#pagination');
    pagination.empty();
    pagination.append(` <li onclick="onPageChange(${page})"
        class="page-item ${page === 0 ? 'disabled' : ''}">
      <a class="page-link" href="#" tabindex="-1" ${page === 0 ? 'aria-disabled="true"' : ''} ><span aria-hidden="true">&laquo;</span></a>
    </li>`)
    for (let i = 1; i <= totalPage; i++) {
        pagination
            .append(`<li class="page-item" onclick="onPageChange(${i})">
                            <a class="page-link ${page + 1 === i ? 'active' : ''} "
                            ${page + 1 === i ? 'aria-current="page"' : ''} href="#">
                                ${i}
                            </a></li>`);

    }

    pagination.append(` <li onclick="onPageChange(${page + 2})"
        class="page-item ${page === totalPage - 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" tabindex="-1" ${page === totalPage - 1 ? 'aria-disabled="true"' : ''} ><span aria-hidden="true">&raquo;</span></a>
    </li>`);
}
const onPageChange = (pageChange) => {
    if(pageChange < 1 || pageChange > totalPage || pageChange === page+1){
        return;
    }
    page = pageChange - 1;
    getAllCustomers();
}

function getDataInput() {
    return [
        {
            label: 'Full Name',
            classContainer: "col-6 mt-3",
            name: 'fullName',
            value: bankingSelected.fullName,
            required: true,
            pattern: "^[A-Za-z]{4,15}",
            message: "Full Name must have minimum is 4 characters and maximum is 15 characters",
        },

        {
            label: 'Phone',
            classContainer: "col-12 mt-3",
            name: 'phone',
            value: bankingSelected.phone,
            pattern: /^\+\d\s\(\d{3}\)\s\d{3}-\d{4}$/,
            message: "Phone is between +X (XXX) XXX-XXXX",
            required: true
        },
        {
            label: 'Email',
            classContainer: "col-12 mt-3",
            name: 'email',
            value: bankingSelected.email,
            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Please enter a valid email address",
            required: true
        },
        {
            label: 'Address',
            classContainer: "col-12 mt-3",
            name: 'address',
            value: bankingSelected.address,
            // pattern: "^[A-Za-z]{4,25}",
            message: "Address must have minimum is 4 characters and maximum is 25 characters",
            required: true
        },
    ];
}
