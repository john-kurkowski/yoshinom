# From http://stackoverflow.com/a/20383651/62269
Ember.LinkView.reopen
  action: null

  _invoke: (event) ->
    if action = @get('action')
      # There was an action specified (in handlebars) so take custom action
      event.preventDefault() # prevent the browser from following the link as normal
      if @bubbles is false
        event.stopPropagation()

      # trigger the action on the controller
      @get('controller').send action, @get('actionParam')
      return false

    # no action to take, handle the link-to normally
    return @_super(event)

Ember.Handlebars.registerBoundHelper 'get-or-else', (value, alt) ->
  if value then value else alt
