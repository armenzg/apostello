var ReprocessButton = React.createClass({
    render: function () {
        if (this.props.sms.loading){
        return(<div/>);
        } else {
            if (this.props.sms.is_archived) {
                var txt = 'UnArchive';
            } else{
                var txt = 'Archive';
            };
        return(<a className='btn btn-secondary btn-sm' onClick={this.props.archiveSms}>{txt}</a>)
        }
    }
});
var SenderCell = React.createClass({
    render: function () {
        return (
            <td>
                <a href={this.props.sms.sender_url} style={{"color": "#212121"}}>{this.props.sms.sender_name}</a>
            </td>
        )
    }
});
var ActionCell = React.createClass({
    render: function () {
        if (this.props.sms.loading){
            return(<td/>)
        }
        else {
            if (this.props.sms.dealt_with) {
                return(<td><a className='btn btn-sm btn-success' onClick={this.props.dealtWithSms}>Completed</a></td>)
                }
            else{
                return(<td><a className='btn btn-sm btn-danger' onClick={this.props.dealtWithSms}>Requires Action</a></td>)
                };
        }
    }
});
var SmsInRow = React.createClass({
    render: function () {
        return (
            <tr>
                <SenderCell sms={this.props.sms}></SenderCell>
                <td>{this.props.sms.time_received}</td>
                <td>{this.props.sms.content}</td>
                <ActionCell sms={this.props.sms} dealtWithSms={this.props.dealtWithSms}/>
                <td className="hidden-sm hidden-xs"><ReprocessButton sms={this.props.sms} archiveSms={this.props.archiveSms}/></td>
            </tr>
        )
    }
});
var KeywordRespTables = React.createClass({
    archiveSms: function (sms) {
        var that = this;
        $.ajax({
            url : '/api/v1/sms/in/'+sms.pk,
            type : "POST",
            data : { 'archive': !sms.is_archived },
            success : function(json) {
              that.loadResponsesFromServer()
            },
            error : function(xhr,errmsg,err) {
                window.alert("uh, oh. That didn't work.")
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    },
    dealWithSms: function (sms) {
        var that = this;
        $.ajax({
            url : '/api/v1/sms/in/'+sms.pk,
            type : "POST",
            data : { 'deal_with': !sms.dealt_with },
            success : function(json) {
              that.loadResponsesFromServer()
            },
            error : function(xhr,errmsg,err) {
                window.alert("uh, oh. That didn't work.")
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    },
    loadResponsesFromServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {data: [{"sender_name": "Loading...", "loading": true}]};
    },
    componentDidMount: function () {
        this.loadResponsesFromServer();
        setInterval(this.loadResponsesFromServer, this.props.pollInterval);
    },
    render: function () {
        var that = this;
        var rows = this.state.data.map(function (sms, index) {
                return (
                        <SmsInRow
                        sms={sms}
                        key={index}
                        archiveSms={that.archiveSms.bind(null, sms)}
                        dealtWithSms={that.dealWithSms.bind(null, sms)}
                        viewingArchive={that.viewingArchive}
                        />)
        });
        return (
            <div className="table-responsive">
            <table className="table table-sm table-striped" style={{'tableLayout':'fixed', 'wordWrap':'break-word'}}>
            <thead>
            <tr>
            <th>From</th>
            <th>Time Received</th>
            <th>Message</th>
            <th>Requires Action?</th>
            <th></th>
            </tr>
            </thead>
            <tbody className="searchable">
            {rows}
            </tbody>
            </table>
            </div>
        );
    }
});