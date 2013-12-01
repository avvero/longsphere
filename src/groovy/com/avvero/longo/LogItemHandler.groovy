package com.avvero.longo

import grails.converters.JSON
import org.atmosphere.cpr.*
import org.atmosphere.websocket.WebSocketEventListenerAdapter

import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import static org.atmosphere.cpr.AtmosphereResource.TRANSPORT.WEBSOCKET

/**
 * User: avvero
 * Date: 24.11.13
 */
class LogItemHandler extends HttpServlet {

    @Override
    void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String mapping = "/log" + request.getPathInfo()
        Broadcaster b = BroadcasterFactory.getDefault().lookup(DefaultBroadcaster.class, mapping, true)
        Meteor m = Meteor.build(request)
        if (m.transport().equals(WEBSOCKET)) {
            m.addListener(new WebSocketEventListenerAdapter() {
                @Override
                void onDisconnect(AtmosphereResourceEvent event) {
                    def x = 1;
                }
            })
        } else {
            m.addListener(new AtmosphereResourceEventListenerAdapter() {
                @Override
                void onDisconnect(AtmosphereResourceEvent event) {
                    def x = 1;
                }
            })
        }
        m.setBroadcaster(b)
    }

    @Override
    void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String mapping = "/log" + request.getPathInfo();
        def jsonMap = JSON.parse(request.getReader().readLine().trim()) as Map
        String type = jsonMap.containsKey("type") ? jsonMap.type.toString() : null
        String message = jsonMap.containsKey("message") ? jsonMap.message.toString() : null

        if (type == null || message == null) {
        } else {
            if (message.toLowerCase().contains("<script")) {
            } else {
                Broadcaster b = BroadcasterFactory.getDefault().lookup(DefaultBroadcaster.class, mapping)
                b.broadcast(jsonMap)
            }
        }
    }

}
