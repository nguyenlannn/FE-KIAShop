import {useEffect, useState} from "react";
import AdminApi from "../../api/AdminApi";
import Domain from "../../base/Domain";
import BasicApi from "../../api/BasicApi";
import EditOrderDetailNote from "../EditOrderDetailNote";
import {useNotification} from "react-hook-notification";
import AdminAddNote from "./AdminAddNote";
import AdminDeleteNote from "./AdminDeleteNote";

const AdminEditOrderStatus = (props) => {
    const notification = useNotification()
    const [order, setOrder] = useState({message: null, success: null, data: {orderDetails: []}})

    useEffect(() => {
        if (localStorage.getItem('accessToken') != null) {
            fetch(AdminApi.getOrderById(props.order.id).url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
                .then(resp => resp.json())
                .then(o => {
                        if (o.success === false) {
                            if (o.errorCode === 401) {
                                if (localStorage.getItem('refreshToken') == null) {
                                    window.location = Domain + "/login"
                                } else {
                                    fetch(BasicApi.refreshToken().url, {
                                        method: BasicApi.refreshToken().method,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': 'Bearer ' + localStorage.getItem('refreshToken')
                                        }
                                    })
                                        .then(resp => resp.json())
                                        .then(oo => {
                                            if (oo.success === false) {
                                                window.location = Domain + "/login"
                                            } else {
                                                localStorage.setItem('accessToken', oo.data.accessToken)
                                                localStorage.setItem('refreshToken', oo.data.refreshToken)
                                                AdminEditOrderStatus(props)
                                            }
                                        })
                                }
                            }
                        } else {
                            setOrder(o)
                        }
                    }
                )
        }
    }, [props]);

    const handleReload = () => {
        if (localStorage.getItem('accessToken') != null) {
            fetch(AdminApi.getOrderById(props.order.id).url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
                .then(resp => resp.json())
                .then(o => {
                        if (o.success === false) {
                            if (o.errorCode === 401) {
                                if (localStorage.getItem('refreshToken') == null) {
                                    window.location = Domain + "/login"
                                } else {
                                    fetch(BasicApi.refreshToken().url, {
                                        method: BasicApi.refreshToken().method,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': 'Bearer ' + localStorage.getItem('refreshToken')
                                        }
                                    })
                                        .then(resp => resp.json())
                                        .then(oo => {
                                            if (oo.success === false) {
                                                window.location = Domain + "/login"
                                            } else {
                                                localStorage.setItem('accessToken', oo.data.accessToken)
                                                localStorage.setItem('refreshToken', oo.data.refreshToken)
                                                AdminEditOrderStatus(props)
                                            }
                                        })
                                }
                            }
                        } else {
                            setOrder(o)
                        }
                    }
                )
        }
    }

    const handleEditStatus = (e) => {
        fetch(AdminApi.editOrderStatus(order.data.id).url, {
            method: AdminApi.editOrderStatus(order.data.id).method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: JSON.stringify({status: e})
        })
            .then(resp => resp.json())
            .then(o => {
                    if (o.success === false) {
                        if (o.errorCode === 401) {
                            if (localStorage.getItem('refreshToken') == null) {
                                window.location = Domain + "/login"
                            } else {
                                fetch(BasicApi.refreshToken().url, {
                                    method: BasicApi.refreshToken().method,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + localStorage.getItem('refreshToken')
                                    }
                                })
                                    .then(resp => resp.json())
                                    .then(oo => {
                                        if (oo.success === false) {
                                            document.location = window.location = Domain + "/login"
                                        } else {
                                            localStorage.setItem('accessToken', oo.data.accessToken)
                                            localStorage.setItem('refreshToken', oo.data.refreshToken)
                                            handleEditStatus(e)
                                        }
                                    })
                            }
                        }
                        notification.error({text: o.message})
                    } else {
                        notification.success({text: 'C???p nh???t tr???ng th??i th??nh c??ng'})
                    }
                }
            )
    }

    return <>
        <span className="text-primary" data-toggle="modal"
              data-target={`#chiTietOrder${order.data.id}`}>Chi ti???t</span>

        <div className="modal fade" id={`chiTietOrder${order.data.id}`} tabIndex="-1"
             aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            T???ng: {order.data.orderDetails.map(i => i.money).reduce((a, b) => a + b, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
                            <select className="form-control" style={{maxWidth: 300, margin: "10px 0"}}
                                    onChange={e => handleEditStatus(e.target.value)}>
                                <option value="PENDING" selected={order.data.status === 'PENDING'}>
                                    Ch??? x??? l??
                                </option>
                                <option value="RESOLVED" selected={order.data.status === 'RESOLVED'}>
                                    ???? x??? l??
                                </option>
                                <option value="COMPLETED" selected={order.data.status === 'COMPLETED'}>
                                    Giao th??nh c??ng
                                </option>
                                <option value="CANCELED" selected={order.data.status === 'CANCELED'}>
                                    H???y b???
                                </option>
                            </select>
                            M?? ????n h??ng: {order.data.id}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {order.data.orderDetails.map(oo =>
                            <div key={oo.id} className="row text-secondary" style={{marginTop: 5}}>
                                <div className="col-sm-2">
                                    <a href={`/product-detail?id=${oo.product.id}`}>
                                        <img className="img-fluid" style={{maxHeight: 200, borderRadius: 5}}
                                             src={oo.product.productImages[0].path} alt=""/>
                                    </a>
                                </div>
                                <div className="col-sm-10" style={{padding: 0, margin: 0}}>
                                    <ul>
                                        <li>M?? s???n ph???m: {oo.product.id}</li>
                                        <li>T??n: {oo.product.name}</li>
                                        <li>S??? l?????ng: {oo.quantity}</li>
                                        <li>Gi??: {oo.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</li>
                                        <li>Gi???m gi??: {oo.discount}%</li>
                                        <li>Th??nh
                                            ti???n: {oo.money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
                                        </li>
                                        <li>Ghi ch??: <AdminAddNote orderDetail={oo} onReload={handleReload}/>
                                            {oo.orderDetailNotes.map(ooo =>
                                                <ul key={ooo.id}>
                                                    <li>Ng?????i t???o: {ooo.createdBy}</li>
                                                    <li>
                                                        <EditOrderDetailNote orderDetailNote={ooo}/>
                                                    </li>
                                                    <AdminDeleteNote note={ooo} onReload={handleReload}/>
                                                </ul>
                                            )}
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-12">
                                    <hr/>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default AdminEditOrderStatus