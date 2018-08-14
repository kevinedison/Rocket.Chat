import {RocketChat} from 'meteor/rocketchat:lib';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {ReactiveVar} from 'meteor/reactive-var';

Meteor.startup(function() {
	const instance = this;
	instance.room = new ReactiveVar('');
	RocketChat.MessageAction.addButton({
		id: 'start-thread',
		icon: 'thread',
		label: 'Thread_start',
		context: ['message', 'message-mobile'],
		action() {
			const message = this._arguments[1];
			Meteor.call('createThreadFromMessage', message, function(error, result) {
				if (result) {
					// remove the hidden message from the UI - the message list is not reactive
					Tracker.nonreactive(function() {
						ChatMessage.remove({
							_id: message._id,
							'u._id': Meteor.userId()
						});
					});

					// navigate to the newly created room
					FlowRouter.goToRoomById(result.rid);
				}
			});
		},
		condition(message) {
			if (RocketChat.models.Subscriptions.findOne({rid: message.rid}) == null) {
				return false;
			}
			if (message.u._id !== Meteor.userId()) {
				return RocketChat.authz.hasAtLeastOnePermission('start-thread-other-user');
			} else {
				return RocketChat.authz.hasAtLeastOnePermission('start-thread');
			}
		},
		order: 0,
		group: 'menu'
	});
});